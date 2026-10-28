const Entrega = require('../models/Entrega')
const { Op } = require('sequelize')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.cidadeDestino || !valores.status || !valores.data || !valores.hora || !valores.idCarga) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (valores.status !== 'ENTREGUE' && valores.status !== 'TRANSITO') {
        return res.status(400).json({ message: 'O status deve ser ENTREGUE ou TRANSITO!' })
    }
    try {
        await Entrega.create({
            cidadeDestino: valores.cidadeDestino,
            status: valores.status,
            data: valores.data,
            hora: valores.hora,
            idCarga: valores.idCarga
        })
        return res.status(201).json({ message: 'Entrega cadastrada com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar entrega:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar entrega!' })
    }
}

const listar = async (req, res) => {
    const { dataInicio, dataFim } = req.query
    const ordem = req.query.ordem || 'ASC'
    if (!['ASC', 'DESC'].includes(ordem) || (dataInicio && dataFim && dataInicio > dataFim)) {
        return res.status(400).json({ message: 'Informe um intervalo de datas válido e ordem ASC ou DESC!' })
    }
    const where = {}
    if (dataInicio || dataFim) {
        where.data = {}
        if (dataInicio) where.data[Op.gte] = dataInicio
        if (dataFim) where.data[Op.lte] = dataFim
    }
    try {
        const dados = await Entrega.findAll({ where, order: [['data', ordem], ['hora', ordem], ['codEntrega', ordem]] })
        return res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar entregas:', err)
        return res.status(500).json({ message: 'Erro ao listar entregas!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = {}
    for (const campo of ['cidadeDestino', 'status', 'data', 'hora', 'idCarga']) {
        const valor = req.body[campo]
        if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
            valores[campo] = valor
        }
    }
    if (!Object.keys(valores).length) {
        return res.status(400).json({ message: 'Informe pelo menos um campo para atualizar!' })
    }
    if (valores.status && valores.status !== 'ENTREGUE' && valores.status !== 'TRANSITO') {
        return res.status(400).json({ message: 'O status deve ser ENTREGUE ou TRANSITO!' })
    }
    try {
        const entrega = await Entrega.findByPk(id)
        if (!entrega) {
            return res.status(404).json({ message: 'Entrega não encontrada!' })
        }
        await Entrega.update(valores, { where: { codEntrega: id } })
        return res.status(200).json({ message: 'Entrega atualizada com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar entrega:', err)
        return res.status(500).json({ message: 'Erro ao atualizar entrega!' })
    }
}

module.exports = { cadastrar, listar, atualizar }
