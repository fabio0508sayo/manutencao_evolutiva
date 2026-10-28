const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('id').value

    try {
        const res = await fetch(`http://localhost:3000/motorista/${id}`, {
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
        resposta.innerHTML = `<table>${criarThead()}${criarTbody([dados])}</table>`
    } catch (err) {
        console.error('Erro ao consultar motorista:', err)
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
        corpo += `<td>${escapar(el.codMotorista)}</td>`
        corpo += `<td>${escapar(el.nome)}</td>`
        corpo += `<td>${escapar(el.cnh)}</td>`
        corpo += `<td>${escapar(el.cpf)}</td>`
        corpo += `<td>${escapar(el.telefone)}</td>`
        corpo += '</tr>'
    })
    corpo += '</tbody>'
    return corpo
}

function criarThead() {
    return `<thead><tr><th>Código</th><th>Nome</th><th>CNH</th><th>CPF</th><th>Telefone</th></tr></thead>`
}
