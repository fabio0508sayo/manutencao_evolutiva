const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Carga = db.define('carga', {
    codCarga: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    peso: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    codigoRastreio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idMotorista: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { key: 'codMotorista', model: 'motoristas' }
    }
}, {
    timestamps: false,
    tableName: 'cargas'
})

module.exports = Carga
