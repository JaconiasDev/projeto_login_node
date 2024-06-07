
const mysql = require("mysql2");

require("dotenv").config();

const conexao = mysql.createConnection({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASS_DATABASE,
    database: process.env.DATABASE
})

conexao.connect(erro =>{
    if(erro){
        console.log('erro in server MYSQL'+ erro)
        return
    }
    console.log('sucesso in connection');
})

// resgatar dados do db
const GetData = () =>{
    conexao.query(`SELECT * FROM ${process.env.DATABASE}.${process.env.TABELA}`,
    (err,rows)=>{
        if(err){
            console.log('erro in rowns'+ err);
            return;
        }
        console.log(rows);
    })   
}


//inserir dados ao banco de dados!
const Insert_Data = (data) =>{
    conexao.query(`INSERT INTO ${process.env.DATABASE}.${process.env.TABELA}(email,senha) VALUES(?,?)`,
    [data.email,data.senha],
    (error)=>{
       if(error){
         console.log('erro na hora de inserir dados '+ error);
         return;
       } 
       console.log('dados adicionados com sucesso')
    })
}

// modificar dados do banco de dados
const  ModifyData = (id,data) => {
    conexao.query(`UPDATE  ${process.env.DATABASE}.${process.env.TABELA} SET email=?,senha=? WHERE id=?`,
    [data.email,data.senha,1],
    (error)=>{
        if(error){
         console.log('error ao atualizar dados! tente novamente');
         return;
        }
        console.log('dados atualizados')
    })
}
//ModifiData(1,{email:'junin2gmail...',senha:'12345/criptrografada'});

// apagar dados do db
const Drop_data = (id) =>{
   conexao.query(`DELETE FROM ${process.env.DATABASE}.${process.env.TABELA} WHERE id=?`,
   [id],
   (error)=>{
     if(error){
        console.log('erro a drop column')
        return;
     }
     console.log('column drop!')
   })
}
// Drop_data(4)
// Drop_data(5)

module.exports = {GetData ,Insert_Data ,ModifyData ,Drop_data,conexao}





