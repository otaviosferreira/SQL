const express = require('express');
const path = require('path');
const pool = require('./database');



const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/usuarios', async (req, res) => {
    const { nome,email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ erro: 'Informe nome e email do usuário.' });
    }
    try {
        const sql ='INSERT INTO usuarios (nome, email) VALUES (?, ?)';
        const [resultado] = await pool.execute(sql, [nome, email]);
        res.status(201).json({ id: resultado.insertId, nome, email });

    } catch (error) {
    console.error('ERRO AO CADASTRAR:', error);

    res.status(500).json({
        erro: 'Não foi possível cadastrar o usuário.',
        detalhe: error.message
    });
}

});

app.get('/usuarios', async (req, res) => {
    try {
        const [usuarios] = await pool.execute(
            'SELECT id, nome, email, criado_em FROM usuarios ORDER BY id DESC'
        );
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: 'Não foi possível listar os usuários.' });
    }
}); 
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});