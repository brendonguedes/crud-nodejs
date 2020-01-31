const express = require('express');

const server = express();

server.use(express.json()); // faz com que o express entenda JSON

// Query params = ?teste=1
// Route params = /geeks/1
// Request body = { "name": "Brendon", "email": "brendon@email.com"}

// CRUD - Create, Read, Update, Delete

const geeks = ['Brendon', 'Lara', 'Gregory', 'Hunter'];

server.use((req, res, next) => { // server.use cria o middleware global
  console.time('Request'); // marca o início da requisição
  console.log(`Método: ${req.method}; URL: ${req.url}; `); // retorna qual o método e url foi chamada

  next(); // função que chama as próximas ações 

  console.log('Finalizou'); // será chamado após a requisição ser concluída

  console.timeEnd('Request'); // marca o fim da requisição
});

function checkGeekExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'geek name is required' });
    // middleware local que irá checar se a propriedade name foi infomada, 
    // caso negativo, irá retornar um erro 400 - BAD REQUEST 
  }
  return next(); // se o nome for informado corretamente, a função next() chama as próximas ações
} 
  
function checkGeekInArray(req, res, next) {
  const geek = geeks[req.params.index];
  if (!geek) {
    return res.status(400).json({ error: 'geek does not exists' });
  } // checa se o Geek existe no array, caso negativo informa que o index não existe no array

  req.geek = geek;

  return next();
}

server.get('/geeks', (req, res) => {
  return res.json(geeks);
}) // rota para listar todos os geeks

server.get('/geeks/:index', checkGeekInArray, (req, res) => {
  return res.json(req.geek);
})

server.post('/geeks', checkGeekExists, (req, res) => {
  const { name } = req.body; // assim esperamos buscar o name informado dentro do body da requisição  
  geeks.push(name);
  return res.json(geeks); // retorna a informação da variavel geeks
})

server.put('/geeks/:index', checkGeekInArray, checkGeekExists, (req, res) => {
  const { index } = req.params; // recupera o index com os dados
  const { name } = req.body;
  geeks[index] = name; // sobrepõe/edita o index obtido na rota de acordo com o novo valor
  return res.json(geeks);
}); // retorna novamente os geeks atualizados após o update

server.delete('/geeks/:index', checkGeekInArray, (req, res) => {
  const { index } = req.params; // recupera o index com os dados

  geeks.splice(index, 1); // percorre o vetor até o index selecionado e deleta uma posição no array

  return res.send();
}); // retorna os dados após exclusão


server.listen(3000);