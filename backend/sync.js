const { Funcionario, Motorista, Carga, Entrega } = require('./models/rel')
const conn = require('./db/conn')

async function syncDataBase() {
    try {
        await conn.sync()
        console.log('Sincronizando tabelas')
    } catch (err) {
        console.error('Erro ao sincronizar', err)
    } finally {
        await conn.close()
        console.log('Fechando a conexão')
    }
}

syncDataBase()
