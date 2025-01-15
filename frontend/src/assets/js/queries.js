import '../../utils/perfil.js'
import { fetchApi } from '../../utils/request.js'

const NOTYF = new Notyf()

const buttonNew = document.getElementById('new')
const buttonDelete = document.getElementById('delete')
const container = document.querySelector('.container')

const route = (endpoint) => `http://localhost:3000/${endpoint}`

window.findByCpf = function (event){
    const cpf = event.value

    const typesSearch = {
        'CpfFuncionario': {
            endpoint: 'funcionarios',
            dropdownSelector: '.drop-cpf-employees'
        },
        'CpfPaciente': {
            endpoint: 'pacientes',
            dropdownSelector: '.drop-cpf-patients'
        }
    }

    const { endpoint, dropdownSelector } = typesSearch[event.id]

    let timeout = setTimeout(async () => {
        
        if (cpf.trim()) {

            clearTimeout(timeout)

            const data = await fetchApi(route(endpoint) + `/like/${cpf}`)
            
            const dropdown = document.querySelector(dropdownSelector)
            dropdown.innerHTML = ""

            data.forEach(people => {
                const span = document.createElement('span')
                span.setAttribute('role', 'button')
                span.setAttribute('cpf', people.Cpf)
                span.className = 'dropdown-item w-100'
                span.textContent = `${people.Cpf} - ${people.Nome}`

                span.addEventListener('click', () => {
                    dropdown.classList.remove('show')
                    event.value = people.Cpf
                })

                dropdown.appendChild(span)
            })

            dropdown.classList.add('show')
        }
    }, 500)
}

async function edit(){
    const id = this.getAttribute('id')

    const data = await fetchApi(route('consultas') + `/${id}`)
    
    const result = await Swal.fire({
        title: `Editar consulta` ,
        html: `
          <form id="form" class="needs-validation" novalidate>
            <div class="container">
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                    <label for="CpfFuncionario" class="form-label">Cpf do funcionario</label>
                    <input onkeyup="findByCpf(this)" type="number" class="form-control" id="CpfFuncionario" value="${data.CpfFuncionario}" name="CpfFuncionario" required>
                    <div class="dropdown-menu drop-cpf-employees"></div>
                </div>
                <div class="col-md-6 mb-3 text-start">
                    <label for="CpfPaciente" class="form-label">Cpf do paciente</label>
                    <input onkeyup="findByCpf(this)" type="number" class="form-control" name="CpfPaciente" id="CpfPaciente" value="${data.CpfPaciente}" name="CpfFuncionario" required>
                    <div class="dropdown-menu drop-cpf-patients"></div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="Data" class="form-label">Data</label>
                  <input type="date" class="form-control" id="Data" name="Data" value="${data.Data}" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="Horario" class="form-label">Horário</label>
                  <input type="time" class="form-control" id="Horario" name="Horario" value="${data.Horario}" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="Valor" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="Valor" name="Valor" value="${data.Valor}" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="Procedimento" class="form-label">Procedimento</label>
                  <input type="text" class="form-control" id="Procedimento" name="Procedimento" value="${data.Procedimento}" required>
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

        const url = route(`consultas`) + `/${id}`
        const response = await fetchApi(url, {
          method: 'PUT',
          body: result.value
        })

        const tableData = document.querySelector('.table tbody')
        tableData.appendChild(buildRowAsDOM(response))

        NOTYF.success('Dados da consulta alterados com sucesso')
    }
}

const buildRowAsString = (data) => {
    return `
        <tr>
            <td><input id="${data.IdConsulta}" class="form-check" type="checkbox" /></td>
            <td>${data.CpfFuncionario}</td>
            <td>${data.CpfPaciente}</td>
            <td>${data.Data}</td>
            <td>${data.Valor}</td>
            <td>${data.Horario}</td>
            <td>${data.Procedimento}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-edit" id="${data.IdConsulta}">Editar</button>
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
    checkbox.id = data.IdConsulta
    checkbox.classList.add('form-check')
    checkboxTd.appendChild(checkbox)

    tr.appendChild(checkboxTd)

    tr.appendChild(createCell(data.CpfFuncionario))
    tr.appendChild(createCell(data.CpfPaciente))
    tr.appendChild(createCell(data.Data))
    tr.appendChild(createCell(data.Valor))
    tr.appendChild(createCell(data.Horario))
    tr.appendChild(createCell(data.Procedimento))

    const button = document.createElement('button')
    button.id = data.IdConsulta
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

const url = route(`consultas`)
const response = await fetchApi(url)

container.appendChild(appendHtml(`
    <div class="table-responsive">
      <table class="table table-hover table-striped my-4">
          <thead>
              <tr>
                  ${[
                      `<input class="form-check" type="checkbox" id="all" />`,
                      "Cpf do funcionário",
                      "Cpf do paciente",
                      "Data",
                      "Valor",
                      "Horário",
                      "Procedimento",
                      ""
                  ].map(th => `<th>${th}</th>`).join('')}
              </tr>
          </thead>
          <tbody>
              ${response.map(data => buildRowAsString(data)).join('')}
          </tbody>
      </table>
    <div>
`))

buttonNew.addEventListener('click', async () => {
    const result = await Swal.fire({
        title: 'Nova Consulta',
        html: `
          <form id="form" class="needs-validation" novalidate>
            <div class="container">
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                    <label for="CpfFuncionario" class="form-label">Cpf do funcionario</label>
                    <input onkeyup="findByCpf(this)" type="number" class="form-control" id="CpfFuncionario" name="CpfFuncionario" required>
                    <div class="dropdown-menu drop-cpf-employees"></div>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="CpfPaciente" class="form-label">Cpf do paciente</label>
                  <input onkeyup="findByCpf(this)" type="number" class="form-control" id="CpfPaciente" name="CpfPaciente" required>
                  <div class="dropdown-menu drop-cpf-patients"></div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="Data" class="form-label">Data</label>
                  <input type="date" class="form-control" id="Data" name="Data" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="Horario" class="form-label">Horário</label>
                  <input type="time" class="form-control" id="Horario" name="Horario" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3 text-start">
                  <label for="Valor" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="Valor" name="Valor" required>
                </div>
                <div class="col-md-6 mb-3 text-start">
                  <label for="Procedimento" class="form-label">Procedimento</label>
                  <input type="text" class="form-control" id="Procedimento" name="Procedimento" required>
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
      const url = route(`consultas`)
      const response = await fetchApi(url, {
        method: 'POST',
        body: result.value
      })

      const tableData = document.querySelector('.table tbody')
      tableData.appendChild(buildRowAsDOM(response))

      NOTYF.success('Consulta agendada com sucesso')
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
        const id = d.getAttribute('id')

        const url = route(`consultas`) + `/${id}`
        const response = await fetchApi(url, {
          method: 'DELETE'
        })

        if(response.IdConsulta){
            d.closest('tr').remove()
            NOTYF.success('Consulta desmarcada com sucesso')
        }
    })
})

document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', edit))