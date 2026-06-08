const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const USUARIOS_FILE = path.join(__dirname, 'usuarios.json');

// Função para ler usuários
function lerUsuarios() {
    try {
        return JSON.parse(fs.readFileSync(USUARIOS_FILE, 'utf8'));
    } catch (error) {
        return {};
    }
}

// Função para salvar usuários
function salvarUsuarios(usuarios) {
    fs.writeFileSync(USUARIOS_FILE, JSON.stringify(usuarios, null, 2));
}

// LOGIN
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;
    const usuarios = lerUsuarios();

    if (usuarios[usuario] && usuarios[usuario].senha === senha) {
        res.json({ sucesso: true, mensagem: 'Login realizado!' });
    } else {
        res.json({ sucesso: false, mensagem: 'Usuário ou senha incorretos' });
    }
});

// ADICIONAR NOVO USUÁRIO (você usa isso para adicionar clientes)
app.post('/api/adicionar-usuario', (req, res) => {
    const { usuario, senha, admin_key } = req.body;

    // Chave de segurança (mude isso!)
    if (admin_key !== 'sua_chave_secreta_aqui') {
        return res.json({ sucesso: false, mensagem: 'Chave inválida' });
    }

    const usuarios = lerUsuarios();

    if (usuarios[usuario]) {
        return res.json({ sucesso: false, mensagem: 'Usuário já existe' });
    }

    usuarios[usuario] = { senha: senha };
    salvarUsuarios(usuarios);

    res.json({
        sucesso: true,
        mensagem: `Usuário ${usuario} criado com sucesso!`
    });
});

// LISTAR USUÁRIOS (com chave)
app.post('/api/listar-usuarios', (req, res) => {
    const { admin_key } = req.body;

    if (admin_key !== 'sua_chave_secreta_aqui') {
        return res.json({ sucesso: false, mensagem: 'Chave inválida' });
    }

    const usuarios = lerUsuarios();
    const lista = Object.keys(usuarios).map(user => ({
        usuario: user,
        criado: usuarios[user].data || 'N/A'
    }));

    res.json({ sucesso: true, usuarios: lista });
});

// DELETAR USUÁRIO (com chave)
app.post('/api/deletar-usuario', (req, res) => {
    const { usuario, admin_key } = req.body;

    if (admin_key !== 'sua_chave_secreta_aqui') {
        return res.json({ sucesso: false, mensagem: 'Chave inválida' });
    }

    const usuarios = lerUsuarios();
    delete usuarios[usuario];
    salvarUsuarios(usuarios);

    res.json({ sucesso: true, mensagem: `Usuário ${usuario} deletado` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Para adicionar usuário, acesse: http://localhost:${PORT}/admin.html`);
});
