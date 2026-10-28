const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
        const res = await fetch(`http://localhost:3000/cargas`, {
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
        console.error('Erro ao listar carga:', err)
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
        corpo += `<td>${escapar(el.codCarga)}</td>`
        corpo += `<td>${escapar(el.descricao)}</td>`
        corpo += `<td>${escapar(el.peso)}</td>`
        corpo += `<td>${escapar(el.volume)}</td>`
        corpo += `<td>${escapar(el.codigoRastreio)}</td>`
        corpo += `<td>${escapar(el.idMotorista)}</td>`
        corpo += '</tr>'
    })
    corpo += '</tbody>'
    return corpo
}

function criarThead() {
    return `<thead><tr><th>Código</th><th>Descrição</th><th>Peso (kg)</th><th>Volume (m³)</th><th>Código numérico de rastreio</th><th>Código do Motorista</th></tr></thead>`
}
