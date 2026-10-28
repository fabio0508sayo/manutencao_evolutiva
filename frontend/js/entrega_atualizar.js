const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('id').value
    const valores = {}
    for (const campo of ["cidadeDestino","status","data","hora","idCarga"]) {
        const valor = document.getElementById(campo).value.trim()
        if (valor) valores[campo] = campo === 'idCarga' ? Number(valor) : valor
    }

    try {
        const res = await fetch(`http://localhost:3000/entrega/${id}`, {
            method: 'PUT',
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
        console.error('Erro ao atualizar entrega:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    }
})
