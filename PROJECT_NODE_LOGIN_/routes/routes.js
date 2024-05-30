const express = require("express");
const app = express();
const router = express.Router();
const exphbs = require('express-handlebars');
const {GetData ,Insert_Data ,ModifyData ,Drop_data,conexao} = require('../db/db');
require('dotenv').config();


router.post('/postBD',(req,res)=>{
    let {nome,comentario} = req.body;

     if(!nome || !comentario){
        res.redirect('/cadastro/erro')
        return;
    }

    let objDados = {
        nome:nome,
        mensagem:comentario
    }

    conexao.query(`SELECT nome , mensagem FROM ${process.env.DATABASE}.${process.env.TABELA} WHERE nome=? AND mensagem=?`,[nome,comentario],
    (err,rowns)=>{
       if(err){
          console.log('error')
          return;
       }

       if(rowns){
        const db = rowns[0]
        if(JSON.stringify(db) === JSON.stringify(objDados)){
           res.status(200).redirect('/cadastro/sucesso')
           return
        }
        // Insert_Data({name:nome,mesagem:comentario})
        //  res.redirect('/cadastro/ok')
        res.redirect('/cadastro/errologin')
        GetData();
       }
    })
 })
 

 router.get('/errologin',(req,res)=>{
    res.send('<h3>dados invalidos <a href="/cadastro/home">voltar</a></h3>')
})

 router.get('/ok',(req,res)=>{
    res.send('<h3>cadastrado com sucesso <a href="/cadastro/home">voltar</a></h3>')
})
 
 router.get('/sucesso',(req,res)=>{
     res.send('<h3>login efetuado <a href="/cadastro/home">voltar</a></h3>')
    // GetData();
 })
 
 router.get('/erro',(req,res)=>{
     res.send('<h3>todos os campos precisa ser preenchido</h3>')
 })
 
 router.get('/home',(req,res)=>{
     res.render('home');
 })
 

module.exports = router;



