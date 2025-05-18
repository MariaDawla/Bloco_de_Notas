require('dotenv').config(); 

const dbJanela= require("./janela")
const express = require("express")
const app = express();
app.use(express.json());
const { connect } = require('./janela'); 
const PORT = 3000;

connect().catch(err => console.error("Erro ao conectar com o banco:", err));

app.post('/janela', async (req, res) => {
    try {
        const {titulo} = req.body; 
        const novaJanela = await dbJanela.criarJanelaComPagina(titulo);
        res.status(201).json(novaJanela);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar janela' });
    }
});

app.get('/deletarJanela/:id', async (req, res) => {
    try{
        const id = req.params.id;

        await dbJanela.deletarJanela(id);
        res.status(200).json({mensagem: "Janela deletada com sucesso"});
    } catch (err) {
    console.log("Erro ao deletar páginas da janela:", err);
    res.status(500).json({ error: 'Erro ao deletar as páginas da janela' });
  }
})

app.get('/listarJanela/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const paginas = await dbJanela.listarJanelaComPaginas(id);
        res.status(200).json(paginas);

    } catch (err) {
    console.log("Erro ao listar a janela:", err.message);
    res.status(500).json({ error: err.message });
  }
})

app.get('/listarJanelas', async (req, res) => {
    try{
        const paginas = await dbJanela.listarTodasJanelasComPaginas();
        res.status(200).json(paginas);

    } catch (err) {
    console.log("Erro ao listar as janelas:", err.message);
    res.status(500).json({ error: err.message });
  }
})

app.put('/atualizarJanela/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {titulo} = req.body; 
        const janela = await dbJanela.atualizarJanela(id, titulo);
        res.status(200).json(janela);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao editar a janela' });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});