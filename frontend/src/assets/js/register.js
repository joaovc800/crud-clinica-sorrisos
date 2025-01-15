localStorage.removeItem('token')
localStorage.removeItem('name')

const form = document.querySelector('form')

const NOTYF = new Notyf()

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const [ name, email, password, confirm ] = e.target

    if(password.value != confirm.value){
        NOTYF.error(`Senhas não conferem`)
        return
    }

    const request = await fetch(`http://localhost:3000/signup`, {
        method: 'POST',
        body: JSON.stringify({
            Email: email.value,
            Senha: password.value,
            Nome: name.value
        }),
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
    })

    const response = await request.json()

    if('error' in response){
        NOTYF.error(response.error)
        return
    }
    

    if(response.token){
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.user.Nome.split(' ')[0])
        localStorage.setItem('access', response.user.Acesso)
        window.location.replace('/home')
    }
    
})