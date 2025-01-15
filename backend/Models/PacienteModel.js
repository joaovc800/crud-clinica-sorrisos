import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class PacienteModel {

  async findLikeCpf(cpf){
    const funcionarios = await prisma.paciente.findMany({
      where: {
        Cpf: {
          contains: cpf
        }
      }
    });

    return funcionarios;
  }

  async find() {
    const pacientes = await prisma.paciente.findMany();

    return pacientes;
  }

  async findOne(Cpf) {
    // Realiza a consulta no banco de dados, com o CPF convertido
    const paciente = await prisma.paciente.findUnique({
      where: {
        Cpf: Cpf, // Cpf já é um número
      },
    });
  
    // Se o paciente não for encontrado, lança erro
    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }
  
    return paciente;
  }

  async create(paciente) {
    const pacientes = await prisma.paciente.create({
      data: {
        Cpf: paciente.Cpf,
        Nome: paciente.Nome,
        Telefone: paciente.Telefone,
        Endereco: paciente.Endereco,
        DataNascimento: paciente.DataNascimento,
        Sexo: paciente.Sexo
      }
    })
    return pacientes;
  }

  async update(paciente) {
    
    const pacientes = await prisma.paciente.update({
      where: {
        Cpf: paciente.Cpf
      },
      data: {
        Nome: paciente.Nome,
        Telefone: paciente.Telefone,
        Endereco: paciente.Endereco,
        DataNascimento: paciente.DataNascimento,
        Sexo: paciente.Sexo
      }
    })
    return pacientes;
  }

  async delete(Cpf) {
    const pacientes = await prisma.paciente.delete({
      where: {
        Cpf: Cpf
      }
    })
    return pacientes;
  }
}

export default new PacienteModel();