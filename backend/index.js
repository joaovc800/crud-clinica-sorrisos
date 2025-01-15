import express from 'express';
import router from './Routers/Router.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
});

app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições


app.use(router);


const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ error: "Erro interno" });
})


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


