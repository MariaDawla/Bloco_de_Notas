require("dotenv").config();
const dbJanela= require("./janela")

const { Pool } = require("pg");

async function connect() {
    const pool = new Pool({
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: Number(process.env.port),
        max: 20,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const client = await pool.connect();
    console.log("Banco de Dados conectado");
    client.release();

    global.connection = pool;

    if (global.connection)
        return global.connection.connect();
}

async function criarPagina(id_janela, titulo, conteudo, tipo) {
    const client = await connect();
    try{
        const paginaResult = await client.query(
            `INSERT INTO Pagina (titulo, conteudo, tipo, id_janela, data_criacao, data_delecao)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, NULL)
             RETURNING *`,
            [titulo, conteudo, tipo, id_janela]
        );

        return {
            pagina: [paginaResult.rows[0]]
        };
    }
    catch (err){
         console.error("Erro ao criar janela com página:", err);
        throw err;
    }
    finally{
        client.release()
    }
    
}

async function atualizarPagina(id, titulo, conteudo, tipo) {
    const client = await connect();
    try{
        const res = await client.query(
            "UPDATE Pagina SET titulo=$1, conteudo=$2, tipo=$3 WHERE id=$4 RETURNING *",
            [titulo, conteudo, tipo, id]
        )
        return {
            pagina : [res.rows[0]]
        }
    }
    finally{
        client.release();
    }
    
}

async function deletarPagina(id) {
  const client = await connect();
  try {
    await client.query("UPDATE pagina SET data_delecao=CURRENT_DATE WHERE id=$1", [id]);
  } 
  finally {
    client.release();
  }
}

async function listarPagina(id) {
    const client = await connect();
    try {
     const pagina = await client.query("SELECT * FROM Pagina WHERE id=$1", [id]);
     return pagina.rows[0];
    }
    finally {
        client.release();
    }
}

async function moverPagina(id, id_janela) {
    const client = await connect();
    try {
        const res = await client.query(
            "UPDATE Pagina SET id_janela=$1 WHERE id=$2 RETURNING *",
            [id_janela, id]
        )
        return dbJanela.listarJanelaComPaginas(id_janela)
    }
    finally{
        client.release();
    }
}



module.exports = { connect, criarPagina, atualizarPagina, deletarPagina, listarPagina, moverPagina
};