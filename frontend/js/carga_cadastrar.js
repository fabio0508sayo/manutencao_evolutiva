const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const valores = {
        descricao: document.getElementById('descricao').value,
        peso: Number(document.getElementById('peso').value),
        volume: Number(document.getElementById('volume').value),
        codigoRastreio: document.getElementById('codigoRastreio').value,
        idMotorista: Number(document.getElementById('idMotorista').value)
    }

    try {
        const res = await fetch(`http://localhost:3000/carga`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify(valores)
        })
        const dados = await res.json()
        if (res.status === 401) {
            localStorage.removeItem('token')
            alert('Faça login novamente, tempo expirado!')
            location.href = '../index.html'
            return
        }
        if (!res.ok) { resposta.textContent = dados.message; return }
        resposta.textContent = dados.message
        form.reset()
    } catch (err) {
        console.error('Erro ao cadastrar carga:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    }
})
