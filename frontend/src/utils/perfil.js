const buttonPerfil = document.getElementById('perfil')

buttonPerfil.innerText = localStorage.getItem('name')

const typeAccess = localStorage.getItem('access')

if(!['Administrador'].includes(typeAccess)){
    const cardEmployees = document.getElementById('card-employees')
    if(cardEmployees){
        cardEmployees.classList.add('opacity-25')
        cardEmployees.querySelector('a').classList.add('disabled')
    }

    const navEmployees = document.querySelector(`.nav-link[href="/employees"]`)
    navEmployees.classList.add('disabled')
}