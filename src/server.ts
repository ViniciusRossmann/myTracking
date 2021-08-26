//server configuration
import routes from "./routes"
import connect from "./db/connect";
const express = require('express');
var cors = require('cors')
const app = express();
const server = require('http').createServer(app);
const { socketConnection } = require('./socketControler');

socketConnection(server, { cors: {}});

app
  .set('port', process.env.port || 3001)
  .use(cors({ origin: '*', credentials:true }))
  .use(express.json())
  .use(routes)

server.listen(app.get('port'), () => {
  console.log(`Server listening at port ${app.get('port')}`);
  connect();
});

/*const bcrypt = require('bcrypt');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

//configurando o websocket
const io = require('socket.io')(server);

//configurando o mongoDB
var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"*/

/*MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err);
  db = client.db('rastrearDB');

  server.listen(3000);//abre o servidor na porta 3000

  app.get('/', (req, res) => {
    res.redirect("/acessar");
  })

  app.get('/acompanhar', (req, res) => {
    if (req.query.id == null) {
      res.redirect('/buscarviagem');
    }
    else {
      var o_id = new mongo.ObjectID(req.query.id);
      var query = { _id: o_id };
      db.collection("viagens").find(query).toArray(function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          res.redirect("/buscarviagem?msg=n");
        }
        else {
          res.render('acompanhar.ejs');
        }
      });
    }
  })

  app.get('/acessar', (req, res) => {
    res.render('acessar.ejs');
  })

  app.get('/listar_viagens', (req, res) => {
    res.redirect("/acessar");
  })

  app.post('/listar_viagens', (req, res) => {
    var query = { cpf: req.body.cpf.replace(/[^0-9]/g, ""), cep: req.body.cep.replace(/[^0-9]/g, "") };
    db.collection("viagens").find(query).toArray(function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        res.redirect("/acessar?msg=n");
      }
      else {
        res.render('listar_viagens.ejs', { data: result })
      }
    });
  })

  app.post('/criar_viagem', (req, res) => {
    db.collection('viagens').save(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.send({ result: "Erro ao salvar viagem" });
      }
      else {
        res.send({ result: "Viagem salva" });
      }
    });
  })

  app.post('/auth', (req, res) => {
    if (req.body.email == null) {
      return res.send({ auth: false, msg: "Email inválido" });
    }
    var query = { email: req.body.email };
    db.collection("motorista").find(query).toArray(function (err, result) {
      if (err) throw err;
      if (result.length != 0) {
        bcrypt.compare(req.body.senha, result[0].senha, function (err, resultado) {
          if (resultado) {
            const id = result[0]._id;
            const token = jwt.sign({ id }, process.env.SECRET, {
              expiresIn: 600 // expires in 10min
            });
            return res.json({ auth: true, token: token });
          }
          else {
            res.send({ auth: false, msg: "Senha incorreta" });
          }
        });
      }
      else {
        res.send({ auth: false, msg: "Email inválido" });
      }
    });
  });

  app.post('/cad_motorista', (req, res) => {
    if (req.body.senha.length < 6) {
      return res.send({ result: "Deve ser informada uma senha com pelo menos 6 digitos" });
    }
    if (req.body.nome == null) {
      return res.send({ result: "Deve ser informado o nome do motorista" });
    }
    if (req.body.email == null) {
      return res.send({ result: "Deve ser informado o email do motorista" });
    }
    bcrypt.hash(req.body.senha, 10, function (err, hash) {
      if (err) {
        console.log(err);
        res.send({ result: "Erro ao registrar motorista" });
      }
      else {
        var motorista = { nome: req.body.nome, email: req.body.email, senha: hash };
        db.collection('motorista').save(motorista, (err, result) => {
          if (err) {
            console.log(err);
            res.send({ result: "Erro ao registrar motorista" });
          }
          else {
            res.send({ result: "Cadastro efetuado" });
          }
        });
      }
    });
  })

  app.get('/enviar', (req, res) => {
    res.render('enviarPos.ejs');
  })

  app.get('/buscarviagem', (req, res) => {
    res.render('buscaviagem.ejs');
  })

  io.on('connection', function (socket) {
    var id = null;
    socket.on('set_id_cli', (msg) => {
      if (msg != "") {
        socket.join(msg);
        id = msg;
        console.log("Cliente buscando para viagem " + id);
        var o_id = new mongo.ObjectID(id);
        var query = { _id: o_id };
        db.collection("viagens").find(query).toArray(function (err, result) {
          if (err) throw err;
          if (result.length != 0) {
            socket.emit('update_pos_client', { latitude: result[0].latitude, longitude: result[0].longitude });
          }
        });
      }
    });
    socket.on('set_id_mot', (msg) => {
      if (msg != "") {
        socket.join(msg);
        id = msg;
        console.log("Motorista enviando para viagem " + id);
      }
    });
    socket.on('update_pos_server', (msg) => {
      socket.to(id).emit('update_pos_client', msg);

      var o_id = new mongo.ObjectID(id);
      var query = { _id: o_id };
      var newvalues = { $set: { latitude: msg.latitude, longitude: msg.longitude } };
      db.collection("viagens").updateOne(query, newvalues, function (err, res) {
        if (err) throw err;
      });
    });
  });
});*/
