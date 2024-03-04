const e = require("express");
const connection = require("../connections/db");

const insertClient = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    if (!nome || !email || !cpf) {
      return res
        .status(400)
        .json({ error: "Os campos email, nome e cpf são obrigatórios." });
    }

    const existingClient = await connection("clientes")
      .where("email", email)
      .orWhere("cpf", cpf)
      .first();

    if (existingClient) {
      return res.status(400).json({ error: "O email ou CPF já existe." });
    }

    const [client] = await connection("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning([
        "id",
        "nome",
        "email",
        "cpf",
        "cep",
        "rua",
        "numero",
        "bairro",
        "cidade",
        "estado",
      ]);

    if (!client || !client.id) {
      return res.status(400).json({ error: "Erro ao cadastrar o cliente." });
    }

    return res
      .status(201)
      .json({ id: client.id, nome: client.nome, email: client.email });
  } catch (error) {
    return res.status(400).json({ error: "Erro interno do servidor." });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  if (!nome || !email || !cpf) {
    return res
      .status(400)
      .json("Os campos email, nome e cpf são obrigatórios.");
  }

  try {
    const existingCliente = await connection("clientes")
      .where("id", id)
      .first();

    if (!existingCliente) {
      return res.status(404).json("Cliente não encontrado.");
    }

    const cpfExisting = await connection("clientes")
      .where("cpf", cpf)
      .first();

    if (cpfExisting) {
      if (cpfExisting.cpf !== existingCliente.cpf) {
        return res.status(404).json("Já existe um cliente cadastrado com esse cpf.");
      }
    }

    const emailExisting = await connection("clientes")
      .where("email", email)
      .first();

    if (emailExisting) {
      if (emailExisting.email !== existingCliente.email) {
        return res.status(404).json("Já existe um cliente cadastrado com esse email.");
      }
    }
    await connection("clientes").where("id", id).update({
      nome,
      email,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    });

    return res.status(204).json("Cliente atualizado com sucesso!");
  } catch (error) {
    return res.status(400).json({ error: "Erro interno do servidor." });
  }
};

const listClients = async (req, res) => {
  try {
    const clients = await connection("clientes");
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json({ error: "Erro interno do servidor." });
  }
};

const detailClient = async (req, res) => {
  const { id } = req.params;

  try {
    const existingClient = await connection("clientes").where("id", id).first();

    if (!existingClient) {
      return res.status(404).json("Cliente não encontrado.");
    }

    return res.status(200).json(existingClient);
  } catch (error) {
    return res.status(400).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  insertClient,
  updateClient,
  listClients,
  detailClient,
};
