const express = require('express'); 
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken'); // Para gerar o token JWT
const app = express();
const port = 3000;

// Middleware para processar requisições com JSON
app.use(express.json());

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',   
    password: 'Yhr@121110', 
    database: 'loja_jogos'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// 1. *Login com credenciais válidas*
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM funcionarios WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const funcionario = results[0];
        bcrypt.compare(senha, funcionario.senha, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao verificar a senha.' });
            }

            if (isMatch) {
                // Gerar um token JWT
                const token = jwt.sign({ id: funcionario.id, email: funcionario.email }, 'secreto', { expiresIn: '1h' });

                return res.status(200).json({ message: 'Login bem-sucedido!', token });
            } else {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
        });
    });
});

// 2. *Cadastro de novo produto (jogo)*
app.post('/jogos', (req, res) => {
    const { nome, genero, preco, quantidade } = req.body;

    if (!nome || !genero || !preco || !quantidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const query = 'INSERT INTO jogos (nome, genero, preco, quantidade) VALUES (?, ?, ?, ?)';
    connection.query(query, [nome, genero, preco, quantidade], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao cadastrar jogo' });
        }

        res.status(201).json({ message: 'Jogo cadastrado com sucesso!' });
    });
});

// 3. *Logout* - A lógica de logout pode ser apenas uma simulação, já que estamos usando um sistema de token JWT.
app.post('/logout', (req, res) => {
    // Para este exemplo, o logout é apenas uma simulação (não revogamos o token no backend).
    res.status(200).json({ message: 'Sessão encerrada com segurança' });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(Servidor rodando em http://localhost:${port});
});

module.exports = app; // Exporte o app para os testes