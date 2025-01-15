import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class FuncionarioModel {

  async find() {
    const funcionarios = await prisma.funcionario.findMany();

    return funcionarios;
  }

  async findLikeCpf(cpf){
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        Cpf: {
          contains: cpf
        }
      }
    });

    return funcionarios;
  }

  async findOne(Cpf) {
    // Realiza a consulta no banco de dados, com o CPF convertido
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        Cpf: Cpf, // Cpf já é um número
      },
    });
  
    // Se o paciente não for encontrado, lança erro
    if (!funcionario) {
      throw new Error('Funcionario não encontrado');
    }
  
    return funcionario;
  }

  async create(Funcionario) {
    const funcionarios = await prisma.funcionario.create({
      data: {
        Cpf: Funcionario.Cpf,
        Nome: Funcionario.Nome,
        Telefone: Funcionario.Telefone,
        Endereco: Funcionario.Endereco,
        Cargo: Funcionario.Cargo,
        Salario: Funcionario.Salario,
        DataAdmissao: Funcionario.DataAdmissao,
        DataNascimento: Funcionario.DataNascimento,
        Sexo: Funcionario.Sexo
      }
    })
    return funcionarios;
  }

  async update(Funcionario) {
    const funcionarios = await prisma.funcionario.update({
      where: {
        Cpf: Funcionario.Cpf
      },
      data: {
        Nome: Funcionario.Nome,
        Telefone: Funcionario.Telefone,
        Endereco: Funcionario.Endereco,
        Cargo: Funcionario.Cargo,
        DataNascimento: Funcionario.DataNascimento,
        Salario: Funcionario.Salario
      }
    })
    return funcionarios;
  }

  async delete(Cpf) {
    const funcionarios = await prisma.funcionario.delete({
      where: {
        Cpf: Cpf
      }
    })
    return funcionarios;
  }
}

export default new FuncionarioModel();