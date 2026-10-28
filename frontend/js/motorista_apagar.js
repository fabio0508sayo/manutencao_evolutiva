const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const form = document.querySelector('form')
const resposta = document.getElementById('resposta')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('id').value
    if (!confirm('Tem certeza que deseja excluir este motorista?')) return

    try {
        const res = await fetch(`http://localhost:3000/motorista/${id}`, {
            method: 'DELETE',
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
        resposta.textContent = dados.message
        form.reset()
    } catch (err) {
        console.error('Erro ao apagar motorista:', err)
        resposta.textContent = 'Erro ao tentar conectar com o servidor.'
    }
})
