const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc} = require('firebase/firestore/lite');
const express = require('express');
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const firebaseConfig = {
    apiKey: 'AIzaSyBJupSNTmCtRSlH9kQbOZwC1zXsfTC0YBI',
    authDomain: 'svg-angular.firebaseapp.com',
    databaseURL: 'https://svg-angular-default-rtdb.firebaseio.com',
    projectId: 'svg-angular',
    storageBucket: 'svg-angular.appspot.com',
    messagingSenderId: '402634435212',
    appId: '1:402634435212:web:f97eb51809195d654869a9',
    measurementId: 'G-TD2M0NTKC1',
};
const fireApp = initializeApp(firebaseConfig);
const db = getFirestore(fireApp);
const documentos = [];
let intervalTimer = '';

app.post('/', function (req, res) {
    res.send('uuuuuu me acharam')
    if(req.body.documento){
        if(documentos.filter(e => e.id === req.body.id).length == 0 && documentos.filter(e => JSON.parse(JSON.stringify(e)) === JSON.parse(JSON.stringify(req.body))).length == 0){
        documentos.push(req.body);
      } else {
            let index = documentos.map(function(e) { return e.id}).indexOf(req.body.id);
          documentos.splice(index, 1, req.body)
        }
        console.log(documentos)
    }else if(req.body.assunto){
          console.log(req.body)
            mandarEmail(req.body['assunto'], req.body['email'], req.body['corpo'], req.body['anexo']);
    }else if(req.body.obj){
        const docRef = addDoc(collection(db, req.body.colecao), req.body.obj);
        console.log('Document written with ID:' + docRef.id);
    }

    clearInterval(intervalTimer);
    intervalTimer = setInterval(() => {
        documentos.map(documento => {
            let dataValidade = new Date();
            let strSplit = documento.dataValidade.split('/');
            dataValidade.setDate(parseInt(strSplit[0]));
            dataValidade.setMonth(parseInt(strSplit[1] - 1))
            dataValidade.setFullYear(parseInt(strSplit[2]));
            dataValidade.setDate(dataValidade.getDate() - documento.antecedencia);
            console.log(dataValidade);
            if(new Date() >= dataValidade){
                console.log('chamei email linha 36');
                mandarEmail("Documento próximo da Data de Validade", documento.email, "O documento: " + documento.documento + ", está próximo da data de validade, no dia: " + documento.dataValidade);
            }
        })
    }, 24 * 60 * 60 * 1000);
})

function mandarEmail(assunto, destinatario, corpo){
    console.log("Email enviado para " + destinatario)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mecprogadm@gmail.com',
        pass: 'oygzheeeeoaihuut'
      }
     })
     let email = {
       from: 'mecprogadm@gmail.com',
       to: destinatario,
       subject: assunto,
       text: corpo,
     };
     transporter.sendMail(email, (error, info) => {
        if(error){
            return console.log(error);
        }
        console.log('Mensagem %s enviada %s', info.messageId, info.response);
     })
}

app.get('/', function (req, res) {
    res.send('teste');
});
  
intervalTimer = setInterval(() => {
    axios.get('http://pudim.com.br')
}, 25 * 60 * 1000);
  
app.listen(process.env.PORT || 8080, () => {
    console.log('Ta aberto no 8080')
});