const Carga = require('../models/Carga')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.descricao || !valores.peso || !valores.volume || !valores.codigoRastreio || !valores.idMotorista) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (!/^\d+$/.test(valores.codigoRastreio)) {
        return res.status(400).json({ message: 'O código de rastreio deve conter apenas números!' })
    }
    try {
        await Carga.create({
            descricao: valores.descricao,
            peso: valores.peso,
            volume: valores.volume,
            codigoRastreio: valores.codigoRastreio,
            idMotorista: valores.idMotorista
        })
        return res.status(201).json({ message: 'Carga cadastrada com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar carga:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar carga!' })
    }
}

const listar = async (req, res) => {
    try {
        const dados = await Carga.findAll()
        return res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar cargas:', err)
        return res.status(500).json({ message: 'Erro ao listar cargas!' })
    }
}

module.exports = { cadastrar, listar }
