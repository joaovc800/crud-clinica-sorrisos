import '../../utils/perfil.js'
import { fetchApi } from '../../utils/request.js'

const NOTYF = new Notyf()

const buttonNew = document.getElementById('new')
const buttonDelete = document.getElementById('delete')
const container = document.querySelector('.container')

const route = (endpoint) => `http://localhost:3000/${endpoint}`

async function edit(){
    const cpf = this.getAttribute('cpf')
    
    const data = await fetchApi(route('pacientes') + `/${cpf}`)
    
    const result = await Swal.fire({
        title: `Editar Paciente` ,
        html: `
          <form id="form" class="needs-validation" novalidate>
            <div class="container">
              <div class="row">
                <div class="col-md-12 mb-3 text-start">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" name="Nome" value="${data.Nome}" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="cpf" class="form-label">CPF</label>
                  <input type="number" class="form-control" id="cpf" name="Cpf" value="${data.Cpf}" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="DataNascimento" class="form-label">Data de Nascimento</label>
                  <input type="date" class="form-control" id="DataNascimento" name="DataNascimento" value="${data.DataNascimento}" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 mb-3 text-start">
                  <label for="endereco" class="form-label">Endereço</label>
                  <input type="text" class="form-control" id="endereco" name="Endereco" value="${data.Endereco}" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="sexo" class="form-label">Sexo</label>
                  <select class="form-select" id="sexo" name="Sexo" required>
                    <option value="">Selecione</option>
                    <option ${data.Sexo == 'Masculino' ? 'selected' : ''} value="Masculino">Masculino</option>
                    <option ${data.Sexo == 'Feminino' ? 'selected' : ''}  value="Feminino">Feminino</option>
                    <option ${data.Sexo == 'Outro' ? 'selected' : ''}  value="Outro">Outro</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="telefone" class="form-label">Telefone</label>
                  <input type="number" class="form-control" id="telefone" name="Telefone" value="${data.Telefone}" required>
                </div>
              </div>
            </div>
          </form>
        `,
        showCloseButton:true,
        confirmButtonText: 'Salvar',
        confirmButtonColor: '#198754',
        preConfirm: () => {
          const form = document.getElementById('form')
          if (!form.checkValidity()) {
            form.reportValidity()
            return false
          }
          const formData = new FormData(form)
          const data = Object.fromEntries(formData.entries())
          return data
        }
    }).then((result) => {
        if (result.isConfirmed) return result
        return { invalid: true }
    })

    if(result.isConfirmed){

        this.closest('tr').remove()

        const url = route(`pacientes`) + `/${cpf}`
        const response = await fetchApi(url, {
          method: 'PUT',
          body:result.value
        })

        const tableData = document.querySelector('.table tbody')
        tableData.appendChild(buildRowAsDOM(response))

        NOTYF.success('Dados do paciente alterados com sucesso')
    }
}

const buildRowAsString = (data) => {
    return `
        <tr>
            <td><input cpf="${data.Cpf}" id="${data.Id}" class="form-check" type="checkbox" /></td>
            <td>${data.Cpf}</td>
            <td>${data.Nome}</td>
            <td>${data.Telefone}</td>
            <td>${data.Endereco}</td>
            <td>${data.DataNascimento}</td>
            <td>${data.Sexo}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-edit" cpf="${data.Cpf}" id="${data.Id}">Editar</button>
            </td>
        </tr>
    `
}

const buildRowAsDOM = (data) => {
    const tr = document.createElement('tr')

    const createCell = (content) => {
        const td = document.createElement('td')
        td.textContent = content
        return td
    }

    const checkboxTd = document.createElement('td')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = data.Id
    checkbox.setAttribute('cpf', data.Cpf)
    checkbox.classList.add('form-check')
    checkboxTd.appendChild(checkbox)

    tr.appendChild(checkboxTd)

    tr.appendChild(createCell(data.Cpf))
    tr.appendChild(createCell(data.Nome))
    tr.appendChild(createCell(data.Telefone))
    tr.appendChild(createCell(data.Endereco))
    tr.appendChild(createCell(data.DataNascimento))
    tr.appendChild(createCell(data.Sexo))

    console.log(data);
    

    const button = document.createElement('button')
    button.setAttribute('cpf', data.Cpf)
    button.id = data.Id
    button.classList.add('btn', 'btn-sm', 'btn-primary', 'btn-edit')
    button.textContent = 'Editar'

    const tdEdit = document.createElement('td')
    tdEdit.appendChild(button)
    tr.appendChild(tdEdit)

    button.addEventListener('click', edit)

    return tr
}

const appendHtml = (string) => {
    const parser = new DOMParser()
    const html = parser.parseFromString(string, 'text/html').body.firstChild
    return html
}

const response = await fetchApi(route(`pacientes`))

container.appendChild(appendHtml(`
  <div class="table-responsive">
    <table class="table table-hover table-striped my-4">
        <thead>
            <tr>
                ${[
                    `<input class="form-check" type="checkbox" id="all" />`,
                    "Cpf",
                    "Nome",
                    "Telefone",
                    "Endereço",                    
                    "Data Nascimento",
                    "Sexo",
                    ""
                ].map(th => `<th>${th}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${response.map(data => buildRowAsString(data)).join('')}
        </tbody>
    </table>
  </div>
`))

buttonNew.addEventListener('click', async () => {
    const result = await Swal.fire({
        title: 'Novo Funcionário',
        html: `
          <form id="form" class="needs-validation" novalidate>
            <div class="container">
              <div class="row">
                <div class="col-md-12 mb-3 text-start">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" name="Nome" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="cpf" class="form-label">CPF</label>
                  <input type="number" class="form-control" id="cpf" name="Cpf" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="DataNascimento" class="form-label">Data de Nascimento</label>
                  <input type="date" class="form-control" id="DataNascimento" name="DataNascimento" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 mb-3 text-start">
                  <label for="endereco" class="form-label">Endereço</label>
                  <input type="text" class="form-control" id="endereco" name="Endereco" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="sexo" class="form-label">Sexo</label>
                  <select class="form-select" id="sexo" name="Sexo" required>
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="telefone" class="form-label">Telefone</label>
                  <input type="number" class="form-control" id="telefone" name="Telefone" required>
                </div>
              </div>
            </div>
          </form>
        `,
        showCloseButton:true,
        confirmButtonText: 'Salvar',
        confirmButtonColor: '#198754',
        preConfirm: () => {
          const form = document.getElementById('form')
          if (!form.checkValidity()) {
            form.reportValidity()
            return false
          }
          const formData = new FormData(form)
          const data = Object.fromEntries(formData.entries())
          return data
        }
    }).then((result) => {
        if (result.isConfirmed) return result
        return { invalid: true }
    })

    if(result.isConfirmed){
      const url = route(`pacientes`)
      const response = await fetchApi(url, {
        method: 'POST',
        body:result.value
      })

      const tableData = document.querySelector('.table tbody')
      tableData.appendChild(buildRowAsDOM(response))

      NOTYF.success('Paciente registrado com sucesso')
    }
    
})

const checkboxAll = document.getElementById('all')
checkboxAll.addEventListener('click', ({target}) => {
    document.querySelectorAll('input[type=checkbox]')
    .forEach(input => input.checked = target.checked)
})

buttonDelete.addEventListener('click', () => {
    const del = document.querySelectorAll('input[type=checkbox]:not(#all):checked')
    del.forEach(async d => {
        const cpf = d.getAttribute('cpf')

        const url = route(`pacientes`) + `/${cpf}`
        const response = await fetchApi(url, {
          method: 'DELETE',
        })

        if(response.Id){
            d.closest('tr').remove()

            NOTYF.success('Paciente excluído com sucesso')
        }
    })
})

document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', edit))