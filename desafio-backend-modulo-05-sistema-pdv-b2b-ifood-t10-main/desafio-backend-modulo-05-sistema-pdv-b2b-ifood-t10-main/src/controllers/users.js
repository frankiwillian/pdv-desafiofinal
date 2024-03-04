const connection = require("../connections/db");
const bcrypt = require("bcrypt");

const insertUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  try {
    const existingUser = await connection("usuarios")
      .where("email", email)
      .first();

    if (existingUser) {
      return res.status(400).json("O email já existe.");
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);

    const [user] = await connection("usuarios")
      .insert({ nome, email, senha: encryptedPassword })
      .returning(["id", "nome", "email"]);

    if (!user) {
      return res.status(400).json("O usuário não foi cadastrado.");
    }

    return res.status(200).json("O usuário foi cadastrado com sucesso!");
  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
};

const detailUserProfile = async (req, res) => {
  const { user } = req;

  try {
    const existingUser = await connection("usuarios")
      .where("id", user.id)
      .first();
    if (!existingUser) {
      return res.status(404).json("Usuário não encontrado.");
    }
    const { senha, ...userProfile } = existingUser;
    return res.status(200).json(userProfile);

  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
};

const editUserProfile = async (req, res) => {
  const { user } = req;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json("É necessário preencher todos os campos.");
  }

  try {
    const existingUser = await connection("usuarios")
      .where("id", user.id)
      .first();

    if (!existingUser) {
      return res.status(404).json("Usuário não encontrado.");
    }

    if (email && email !== existingUser.email) {
      const emailExists = await connection("usuarios")
        .where("email", email)
        .first();
      if (emailExists) {
        return res.status(400).json("O novo email já está sendo utilizado por outro usuário.");
      }
    }

    const updatedFields = {};
    if (nome) updatedFields.nome = nome;
    if (email) updatedFields.email = email;
    if (senha) {
      const encryptedPassword = await bcrypt.hash(senha, 10);
      updatedFields.senha = encryptedPassword;
    }

    await connection("usuarios")
      .where("id", user.id)
      .update(updatedFields);

    return res.status(200).json("Perfil do usuário foi atualizado com sucesso.");
  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
};



module.exports = {
  insertUser,
  detailUserProfile,
  editUserProfile
};
