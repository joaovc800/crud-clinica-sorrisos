import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class ConsultaModel {

  async find() {
    const consultas = await prisma.consulta.findMany();

    return consultas;
  }

  async findById(IdConsulta) {
    const consulta = await prisma.consulta.findUnique({
      where: {
        IdConsulta: parseInt(IdConsulta), 
      },
    });
  
    if (!consulta) {
      throw new Error('consulta não encontrado');
    }
  
    return consulta;
  }

  async create(consulta) {
    const consultas = await prisma.consulta.create({
      data: {
        CpfFuncionario: consulta.CpfFuncionario,
        CpfPaciente: consulta.CpfPaciente,
        Data: consulta.Data,
        Valor: parseFloat(consulta.Valor),
        Horario: consulta.Horario,
        Procedimento: consulta.Procedimento
      }
    })
    return consultas;
  }

  async update(consulta) {
    const consultas = await prisma.consulta.update({
      where: {
        IdConsulta: parseInt(consulta.IdConsulta), // Usa IdConsulta para encontrar o registro
      },
      data: {
        CpfFuncionario: consulta.CpfFuncionario,
        CpfPaciente: consulta.CpfPaciente,
        Data: consulta.Data,
        Valor: parseFloat(consulta.Valor),
        Horario: consulta.Horario,
        Procedimento: consulta.Procedimento,
      },
    });
    return consultas;
  }
  

  async delete(IdConsulta) {
    const consultas = await prisma.consulta.delete({
      where: {
        IdConsulta: parseInt(IdConsulta)
      }
    })
    return consultas;
  }
}

export default new ConsultaModel();