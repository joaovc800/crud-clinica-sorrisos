
import { Router } from 'express';
import FuncionarioController from '../Controllers/FuncionarioController.js';
import PacienteController from '../Controllers/PacienteController.js';
import ConsultaController from '../Controllers/ConsultaController.js';

import { login, signup, authenticateToken, isManager, me } from '../auth.js';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/me', authenticateToken, me)

router.get('/funcionarios', authenticateToken, isManager, FuncionarioController.index);

router.get('/funcionarios/:Cpf', authenticateToken, isManager, FuncionarioController.show);

router.get('/funcionarios/like/:Cpf', authenticateToken, isManager, FuncionarioController.findLikeCpf);

router.post('/funcionarios', authenticateToken, isManager, FuncionarioController.store);  // Rota para adicionar funcionário

router.put('/funcionarios/:Cpf', authenticateToken, isManager, FuncionarioController.update);

router.delete('/funcionarios/:Cpf', authenticateToken, isManager, FuncionarioController.destroy);

router.get('/pacientes', authenticateToken, PacienteController.index);

router.get('/pacientes/:Cpf', authenticateToken, PacienteController.show);

router.get('/pacientes/like/:Cpf', authenticateToken, PacienteController.findLikeCpf);

router.post('/pacientes', authenticateToken, PacienteController.store);  

router.put('/pacientes/:Cpf', authenticateToken, PacienteController.update);

router.delete('/pacientes/:Cpf', authenticateToken, PacienteController.destroy);


router.get('/consultas', authenticateToken, ConsultaController.index);

router.get('/consultas/:IdConsulta', authenticateToken, ConsultaController.show);

router.post('/consultas', authenticateToken, ConsultaController.store);  

router.put('/consultas/:IdConsulta', authenticateToken, ConsultaController.update);

router.delete('/consultas/:IdConsulta', authenticateToken, ConsultaController.destroy);

export default router;
