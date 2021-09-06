# myTracking

Esse projeto é um serviço de rastreio de entrega de encomendas. Nele, usuários podem acompanhar entregas em tempo real no mapa. 

É composto por 3 partes:
- Backend: Web API em Express.js, presente nesse repositório.
- Frontend em React.js, onde os usuários podem fazer login e acompanhar suas entregas, presente nesse repositório.
- Aplicativo React Native (com Expo), onde os entregadores criam as viagems e efetuam seu rastreamento. Esse aplicativo pode ser encontrado no repositório [myTracking-app](https://github.com/ViniciusRossmann/myTracking-app).

## Tecnologias

Nesse projeto são abordadas as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [React](https://reactjs.org)
- [OpenLayers](https://openlayers.org)
- WebSockets
- Autenticação com JSON Web Tokens

## Instalação

Instalação dos módulos necessários:

```bash
npm install
cd frontend && yarn install
```

Configuração: 

É necessária criar um arquivo .env na raiz do projeto, com os parâmetros:

- secret: Segredo usado na geração e validação de tokens pelo jwt (JSON Web Tokens).
- DB_CONNECT: Url de conexão com o banco de dados mongoDB.

Execução:

```bash
npm run dev
```

Testes unitários:

```bash
npm run test
```

## Contato

- Autor: Vinícius Rossmann Nunes
- Contato: viniciusrossmann@gmail.com
