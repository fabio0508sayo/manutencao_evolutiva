const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const parametros = new URLSearchParams({ dataInicio: document.getElementById('dataInicio').value, dataFim: document.getElementById('dataFim').value, ordem: document.getElementById('ordem').value })

    try {
        const res = await fetch(`http://localhost:3000/entregas?${parametros}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
        })
        const dados = await res.json()
        if (res.status === 401) {
            localStorage.removeItem('token')
            alert('Faça login novamente, tempo expirado!')
            location.href = '../index.html'
            return
        }
        if (!res.ok) { resposta.textContent = dados.message; return }
        resposta.innerHTML = `<table>${criarThead()}${criarTbody(dados)}</table>`
    } catch (err) {
        console.error('Erro ao listar entrega:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    }
})

function escapar(valor) {
    const elemento = document.createElement('span')
    elemento.textContent = valor ?? ''
    return elemento.innerHTML
}

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += '<tr>'
        corpo += `<td>${escapar(el.codEntrega)}</td>`
        corpo += `<td>${escapar(el.cidadeDestino)}</td>`
        corpo += `<td>${escapar(el.status)}</td>`
        corpo += `<td>${escapar(el.data)}</td>`
        corpo += `<td>${escapar(el.hora)}</td>`
        corpo += `<td>${escapar(el.idCarga)}</td>`
        corpo += '</tr>'
    })
    corpo += '</tbody>'
    return corpo
}

function criarThead() {
    return `<thead><tr><th>Código</th><th>Cidade Destino</th><th>Status</th><th>Data</th><th>Horário</th><th>Código da Carga</th></tr></thead>`
}
