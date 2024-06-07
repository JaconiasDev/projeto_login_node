const express = require("express");
const app = express();
const router = express.Router();
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const {GetData ,Insert_Data ,ModifyData ,Drop_data,conexao} = require('../db/db');
require('dotenv').config();


router.post('/postBD', (req,res)=>{
    let {email,senha} = req.body;

     if(!email || !senha){
        res.redirect('/cadastro/erro')
        return;
    }
    
    conexao.query(`SELECT email,senha FROM ${process.env.DATABASE}.${process.env.TABELA} WHERE email=?`,
        [email],
         async (err,rowns)=>{
            try{
                if(err){
                    console.log('erro ao selecionar dados')
                }
               if(rowns){
                let db = rowns[0]
    
                let emailVerify = db.email
                let senhaVerify = db.senha
                let senhaCripto = await  bcrypt.compare(senha,senhaVerify); 
                if(email == emailVerify && senhaCripto == true){
                    res.status(200).redirect('/cadastro/sucesso')
                    GetData();
                    return
                }
                res.redirect('/cadastro/errologin')
                return
               }
            }catch(err){
              console.log(err) 
            }  

     })
 })
 

 router.get('/cadastrarse',(req,res)=>{
    res.render('tela2')
})

router.post('/DadosCadastro', async (req,res)=>{
    let {email , senha , senhaConfirm} = req.body;

    let criptoSenha =  await bcrypt.hash(senhaConfirm,10);

    let obj = {
        email:email
    }
    conexao.query(`SELECT email FROM ${process.env.DATABASE}.${process.env.TABELA} WHERE email=? `,[email],(err,rowns)=>{
        let popUP = false;
       try{
        if(err){
            console.log('erro ao obter dados especificos')
           }
           let dadosdb = rowns[0]
           if(JSON.stringify(dadosdb) === JSON.stringify(obj)){
             res.render('tela2',{veryfi: true})
           }
           if(senha === senhaConfirm){
            popUP=true
            Insert_Data({email:email,senha:criptoSenha});
            res.render('tela2',{veryfi: false,popUp:popUP})
            return
           }
       }catch(err){
          console.log('erro '+ err)
       }
    })


})

 router.get('/errologin',(req,res)=>{
    res.send('<h3>pessoa nao cadastrada , volte e cadastre-se <a href="/cadastro/home">voltar</a></h3>')
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



