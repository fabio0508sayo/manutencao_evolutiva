const Motorista = require('../models/Motorista')
const { Op } = require('sequelize')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.cnh || !valores.cpf || !valores.telefone) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }
    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }
    try {
        const cnhCriptografada = CryptoJS.AES.encrypt(valores.cnh, CHAVE_SECRETA).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()

        await Motorista.create({
            nome: valores.nome,
            cnh: cnhCriptografada,
            cpf: cpfCriptografado,
            telefone: valores.telefone
        })
        return res.status(201).json({ message: 'Motorista cadastrado com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar motorista:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar motorista!' })
    }
}

const listar = async (req, res) => {
    try {
        const nome = typeof req.query.nome === 'string' ? req.query.nome.trim() : ''
        const motoristas = await Motorista.findAll({ where: nome ? { nome: { [Op.substring]: nome } } : {} })
        let resultado = []
        motoristas.forEach(el => {
            const bytesCnh = CryptoJS.AES.decrypt(el.cnh, CHAVE_SECRETA)
            const cnhDescriptografada = bytesCnh.toString(CryptoJS.enc.Utf8)
            const bytesCpf = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
            const cpfDescriptografado = bytesCpf.toString(CryptoJS.enc.Utf8)

            resultado.push({
                codMotorista: el.codMotorista,
                nome: el.nome,
                cnh: cnhDescriptografada,
                cpf: cpfDescriptografado,
                telefone: el.telefone
            })
        })
        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar motoristas:', err)
        return res.status(500).json({ message: 'Erro ao listar motoristas!' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }

        const bytesCnh = CryptoJS.AES.decrypt(motorista.cnh, CHAVE_SECRETA)
        const cnhDescriptografada = bytesCnh.toString(CryptoJS.enc.Utf8)
        const bytesCpf = CryptoJS.AES.decrypt(motorista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytesCpf.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codMotorista: motorista.codMotorista,
            nome: motorista.nome,
            cnh: cnhDescriptografada,
            cpf: cpfDescriptografado,
            telefone: motorista.telefone
        })
    } catch (err) {
        console.error('Erro ao consultar motorista:', err)
        return res.status(500).json({ message: 'Erro ao consultar motorista!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body
    const dadosAtualizados = {}
    for (const campo of ['nome', 'cnh', 'cpf', 'telefone']) {
        if (typeof valores[campo] === 'string' && valores[campo].trim()) {
            dadosAtualizados[campo] = valores[campo].trim()
        }
    }
    if (!Object.keys(dadosAtualizados).length) {
        return res.status(400).json({ message: 'Informe pelo menos um campo para atualizar!' })
    }
    if (dadosAtualizados.cpf && dadosAtualizados.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }
    for (const campo of ['cnh', 'cpf']) {
        if (dadosAtualizados[campo]) {
            dadosAtualizados[campo] = CryptoJS.AES.encrypt(dadosAtualizados[campo], CHAVE_SECRETA).toString()
        }
    }
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }
        await Motorista.update(dadosAtualizados, { where: { codMotorista: id } })
        return res.status(200).json({ message: 'Motorista atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar motorista:', err)
        return res.status(500).json({ message: 'Erro ao atualizar motorista!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }
        await Motorista.destroy({ where: { codMotorista: id } })
        return res.status(200).json({ message: 'Motorista excluído com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar motorista:', err)
        return res.status(500).json({ message: 'Erro ao apagar motorista!' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar }
