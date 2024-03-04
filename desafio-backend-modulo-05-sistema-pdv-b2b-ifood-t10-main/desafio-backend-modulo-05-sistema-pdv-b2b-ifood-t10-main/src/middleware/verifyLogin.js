const connection = require("../connections/db");
const jwt = require("jsonwebtoken");
const hash = require("../password/hash");

const veryfyLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, hash);

    const user = await connection("usuarios")
      .select("*")
      .where("id", id)
      .first();

    if (!user) {
      return res.status(404).json("Usuário não encontrado");
    }

    const { senha, ...dadosUser } = user;

    req.user = dadosUser;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = veryfyLogin;
