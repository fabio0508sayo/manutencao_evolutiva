const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const valores = { email: document.getElementById('email').value.trim(), senha: document.getElementById('senha').value }
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
    })
    .then(async res => {
        const dados = await res.json()
        resposta.textContent = dados.message
        if (res.ok && dados.token) {
            localStorage.setItem('token', dados.token)
            localStorage.setItem('nomeFuncionario', dados.nome)
            location.href = '../index.html'
        }
    })
    .catch(err => {
        console.error('Erro no login:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    })
})
