const Funcionario = require('./Funcionario')
const Motorista = require('./Motorista')
const Carga = require('./Carga')
const Entrega = require('./Entrega')

Motorista.hasMany(Carga, {
    foreignKey: 'idMotorista',
    as: 'motoristaCarga',
    onDelete: 'CASCADE'
})

Carga.belongsTo(Motorista, {
    foreignKey: 'idMotorista',
    as: 'cargaMotorista',
    allowNull: false
})

Carga.hasMany(Entrega, {
    foreignKey: 'idCarga',
    as: 'cargaEntrega',
    onDelete: 'CASCADE'
})

Entrega.belongsTo(Carga, {
    foreignKey: 'idCarga',
    as: 'entregaCarga',
    allowNull: false
})

module.exports = { Funcionario, Motorista, Carga, Entrega }
