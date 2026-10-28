const btn_cadastrar = document.getElementById('btn_cadastrar')
const resposta = document.getElementById('resposta')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const valores = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    }

    fetch('http://localhost:3000/funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
    })
    .then(async res => {
        const dados = await res.json()
        resposta.textContent = dados.message
        if (res.ok) document.querySelector('form').reset()
    })
    .catch(err => {
        console.error('Erro ao cadastrar funcionário:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    })
})
