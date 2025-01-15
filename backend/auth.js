import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = "1!1nbdsugd#$2hjdhnds*kdpjs1d2";

export async function signup(req, res) {
  const { Nome, Email, Senha } = req.body;

  const existingUser = await prisma.Usuario.findUnique({ where: { Email } });
  if (existingUser)
    return res.status(400).json({ error: "E-mail já registrado." });

  const hashedPassword = await bcrypt.hash(Senha, 10);

  const user = await prisma.Usuario.create({
    data: { Nome, Email, Senha: hashedPassword, Acesso: 'Usuário' },
  });

  const token = jwt.sign({ userId: user.Id, role: user.Acesso }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    token,
    user: { Id: user.Id, Nome: user.Nome, Email: user.Email, Acesso: user.Acesso },
  });
}

export async function login(req, res) {
  const { Email, Senha } = req.body;

  const user = await prisma.Usuario.findUnique({ where: { Email } });
  
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  const valIdPassword = await bcrypt.compare(Senha, user.Senha);
  if (!valIdPassword) return res.status(401).json({ error: "Senha inválIda." });

  const token = jwt.sign({ userId: user.Id, role: user.Acesso }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    token,
    user: { Id: user.Id, Nome: user.Nome, Email: user.Email, Acesso: user.Acesso },
  });
}

export async function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ invalidToken: true, message: "Token inválido." });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ invalidToken: true, message: "Token inválido." });
  }
}

export function isManager(req, res, next) {
  if (req.user.role !== "Administrador") {
    return res.status(403).json({ accessDanied: true, message: "Acesso negado. Apenas administradores podem acessar esta rota." });
  }
  next();
}

export async function me(req, res){
  try {
    const userId = req.user.userId;

    const user = await prisma.Usuario.findUnique({
      where: { Id: userId },
      select: { Id: true, Nome: true, Email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário logado.", details: error.message });
  }
}
