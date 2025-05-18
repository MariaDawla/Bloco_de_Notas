require("dotenv").config();

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



async function criarJanelaComPagina(titulo) {
    const client = await connect();

    try {
        await client.query('BEGIN');

        const janelaResult = await client.query(
            "INSERT INTO Janela (titulo, data_criacao, data_delecao) VALUES ($1, CURRENT_DATE, NULL) RETURNING id",
            [titulo]
        );

        const janelaId = janelaResult.rows[0].id;

        const paginaResult = await client.query(
            `INSERT INTO Pagina (titulo, conteudo, tipo, id_janela, data_criacao, data_delecao)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, NULL)
             RETURNING *`,
            ["", "", "text", janelaId]
        );

        await client.query('COMMIT');

        return {
            id: janelaId,
            paginas: [paginaResult.rows[0]]
        };

    } 
    catch (err) {
        await client.query('ROLLBACK');
        console.error("Erro ao criar janela com página:", err);
        throw err;
    } 
    finally {
        client.release();
    }
}

async function deletarJanela(id) {
  const client = await connect();
  try {
    await client.query("UPDATE pagina SET data_delecao=CURRENT_DATE WHERE id_janela=$1", [id]);
    await client.query("UPDATE janela SET data_delecao=CURRENT_DATE WHERE id=$1", [id]);
  } finally {
    client.release();
  }
}


async function listarJanelaComPaginas(id) {
  const client = await connect();
  try {
    // Busca a janela
    const janelaResult = await client.query(
      `SELECT * FROM janela
       WHERE id = $1 AND data_delecao IS NULL`,
      [id]
    );

    if (janelaResult.rowCount === 0) {
      throw new Error("Janela não encontrada");
    }

    const janela = janelaResult.rows[0];

    const paginasResult = await client.query(
      `SELECT *
       FROM pagina
       WHERE id_janela = $1 AND data_delecao IS NULL
       ORDER BY data_criacao`,
      [id]
    );

    janela.paginas = paginasResult.rows;
    return janela;

  } finally {
    client.release();
  }
}

async function listarTodasJanelasComPaginas() {
  const client = await connect();
  try {
    const janelasResult = await client.query(
      `SELECT * FROM janela WHERE data_delecao IS NULL`
    );

    const janelas = janelasResult.rows;

    const paginasResult = await client.query(
      `SELECT * FROM pagina
       WHERE data_delecao IS NULL`
    );

    const todasPaginas = paginasResult.rows;

    for (const janela of janelas) {
      janela.paginas = todasPaginas.filter(p => p.id_janela === janela.id);
    }
    return janelas;
    
  } finally {
    client.release();
  }
}

async function atualizarJanela(id, titulo) {
  const client = await connect();
  try {
    const res = await client.query(
      "UPDATE Janela SET titulo=$1 WHERE id=$2",
      [titulo, id]
    );
    return res.rows;
  } finally {
    client.release();
  }
}


module.exports = { connect, criarJanelaComPagina, deletarJanela, listarJanelaComPaginas, listarTodasJanelasComPaginas, atualizarJanela
};

