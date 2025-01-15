localStorage.removeItem('token')
localStorage.removeItem('name')

const form = document.querySelector('form')

const NOTYF = new Notyf()

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const [ email, password ] = e.target

    const request = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        body: JSON.stringify({
            Email: email.value,
            Senha: password.value
        }),
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
    })

    const response = await request.json()
    
    if(response.error){
        NOTYF.error(response.error)
        return
    }

    localStorage.setItem('token', response.token)
    localStorage.setItem('name', response.user.Nome.split(' ')[0])
    localStorage.setItem('access', response.user.Acesso)
    window.location.replace('/home')
})