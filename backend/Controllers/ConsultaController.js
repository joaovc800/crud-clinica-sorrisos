
import ConsultaModel from '../Models/ConsultaModel.js';


class ConsultaController {
  
  async index(req, res) {
    const Consultas = await ConsultaModel.find();
    res.json(Consultas);
  }

  async store(req, res) {
    const CpfFuncionario = req.body.CpfFuncionario;
    const CpfPaciente = req.body.CpfPaciente;
    const Data = req.body.Data; 
    const Valor = req.body.Valor;
    const Horario = req.body.Horario; 
    const Procedimento = req.body.Procedimento;
    const Consulta = await ConsultaModel.create({ CpfFuncionario, CpfPaciente, Data, Valor, Horario, Procedimento  });
    res.json(Consulta);
  }

  async show(req, res) {
    const { IdConsulta } = req.params; // Certifique-se de que "id" vem da URL ou de onde for necessário
    try {
      const Consulta = await ConsultaModel.findById(IdConsulta); // Usando "id"
      res.json(Consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const IdConsulta = req.body.IdConsulta || req.params.IdConsulta; // Captura IdConsulta
    const CpfFuncionario = req.body.CpfFuncionario;
    const CpfPaciente = req.body.CpfPaciente;
    const Data = req.body.Data; 
    const Valor = req.body.Valor;
    const Horario = req.body.Horario; 
    const Procedimento = req.body.Procedimento;
  
    try {
      const Consulta = await ConsultaModel.update({
        IdConsulta, // Inclui IdConsulta no objeto
        CpfFuncionario,
        CpfPaciente,
        Data,
        Valor,
        Horario,
        Procedimento,
      });
      res.json(Consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  

  async destroy(req, res) {
    const IdConsulta  = req.params.IdConsulta;
    const Consulta = await ConsultaModel.delete(IdConsulta);
    res.json(Consulta);
  }
}

export default new ConsultaController();
