const connection = require("../connections/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hash = require("../password/hash");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json("É obrigatório email e senha.");
  }

  try {
    const users = await connection("usuarios")
      .where("email", email)
      .select("*");

    if (users.length === 0) {
      return res.status(404).json("Usuário não encontrado.");
    }

    const user = users[0];

    const password = await bcrypt.compare(senha, user.senha);

    if (!password) {
      return res.status(400).json("Email e senha não conferem.");
    }

    const token = jwt.sign({ id: user.id }, hash, { expiresIn: "8h" });

    const { senha: _, ...dadosUser } = user;

    return res.status(200).json({
      user: dadosUser,
      token,
    });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  login,
};
