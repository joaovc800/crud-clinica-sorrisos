export async function fetchApi(url, config){
    
    const token = localStorage.getItem('token')

    const body = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    if(config && config.body){
        body.body = JSON.stringify(config.body)
    }

    if(config && config.method){
        body.method = config.method
    }
    
    try {
        const request = await fetch(url, body);
        const response = await request.json();

        if (response.invalidToken || response.accessDanied) throw response
    
        return response
        
    } catch (error) {
        
        let config = {
            access: {
                title: `Acesso negado`,
                message: error.message,
                anchor: `<a href="/home" class="btn btn-primary mt-3">Voltar para a Página Inicial</a>`
            },
            token:{
                title: error.message,
                message: 'O token fornecido é inválido ou está ausente. Verifique e tente novamente.',
                anchor: `<a href="/" class="btn btn-primary mt-3">Voltar para o login</a>`
            }
        }

        let type

        if(error.accessDanied){
            type = config.access
        }

        if(error.invalidToken){
            type = config.token
        }
        
        Swal.fire({
            customClass: {
                container: 'container-token-invalid'
            },
            showConfirmButton: false,
            html: `
                <h1 class="mt-3 text-danger">${type.title}</h1>
                <p class="text-muted">${type.message}</p>
                ${type.anchor}
            `,
            didOpen: () => {
                const container = document.querySelector('.container-token-invalid')
                container.style = 'backdrop-filter: blur(10px);'
            }
        })
    }
    
}