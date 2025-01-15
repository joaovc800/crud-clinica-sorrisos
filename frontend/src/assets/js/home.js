import '../../utils/perfil.js'
import { fetchApi } from '../../utils/request.js'

const reponse = await fetchApi(`http://localhost:3000/me`)

const usernameSpan = document.getElementById('username')
usernameSpan.textContent = reponse.Nome.split(' ')[0]
