const connection = require("../connections/db");

const listCategories = async (req, res) => {
  try {
    const categorias = await connection("categorias");
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  listCategories
};
