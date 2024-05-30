const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const {createProxyMiddleware} = require("http-proxy-middleware");
const path = require('path')
require('dotenv').config();

// server proxy redirect
app.use('/redirect',createProxyMiddleware({
    target:'https://youtube.com.br',
    changeOrigin:true
}));
  
// config middlewares ...
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/cadastro',require('./routes/routes'))
// config engine ...
app.engine('handlebars',exphbs.engine());
app.set('view engine', 'handlebars');


app.get('/',(req,res)=>{
    res.send('ola bem vindo');
})

app.use((req,res,next)=>{
    res.status(404).send('<h1>pag not found <br> <a href="/cadastro/home">voltar<a></h1>')
})

app.listen(5000,()=>{
    console.log('server running')
})