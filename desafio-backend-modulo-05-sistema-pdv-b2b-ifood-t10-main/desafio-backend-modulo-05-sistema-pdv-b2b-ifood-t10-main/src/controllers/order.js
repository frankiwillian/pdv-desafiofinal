const connection = require("../connections/db");
const transporter = require("../connections/connectNodemailer");

const insertOrder = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  if (isNaN(cliente_id)) {
    return res.status(400).json({ mensagem: "É necessário informar um número de id válido." });
  }

  if (!Array.isArray(pedido_produtos) || !pedido_produtos.length) {
    return res.status(400).json({ mensagem: "O campo pedido_produtos é obrigatório." });
  }

  for (const produto of pedido_produtos) {
    if (isNaN(produto.produto_id)) {
      return res.status(400).json({ mensagem: "É necessário informar um número de id válido." });
    }
    if (isNaN(produto.quantidade_produto)) {
      return res.status(400).json({ mensagem: "É necessário informar um valor válido no campo quantidade_produto." });
    }
  }
  try {

    const existingClient = await connection("clientes")
      .where("id", cliente_id)
      .first();

    if (!existingClient) {
      return res.status(400).json({ mensagem: "O Cliente não existe." });
    }

    let totalValueOrder = 0;
    for (const produto of pedido_produtos) {

      const productsOrderEcxistent = await connection("produtos")
        .where("id", produto.produto_id)
        .first()
      if (!productsOrderEcxistent) {
        return res.status(400).json({ mensagem: `O produto de id ${produto.produto_id} está em falta ou não existe .` });
      } else {
        if (produto.quantidade_produto > productsOrderEcxistent.quantidade_estoque) {
          return res.status(400).json({ mensagem: `Não temos a quantidade do seu pedido do produto de id ${produto.produto_id} em estoque.` });
        } else {
          totalValueOrder += productsOrderEcxistent.valor * produto.quantidade_produto;
        }
      }
    }

    const [registeredOrder] = await connection("pedidos")
      .insert({
        cliente_id,
        observação: observacao,
        valor_total: totalValueOrder
      })
      .returning("*");

    transporter.sendMail({
      from: `${process.env.MAIL_NAME} <${process.env.MAIL_FROM}>`,
      to: `${existingClient.nome} <${existingClient.email}>`,
      subject: "Compra Aprovada!",
      text: "Seu pedido foi efetuado com sucesso!"
    });

    for (const produto of pedido_produtos) {

      const productsOrderEcxistent = await connection("produtos")
        .where("id", produto.produto_id)
        .first()

      await connection("pedido_produtos")
        .insert({
          pedido_id: registeredOrder.id,
          produto_id: produto.produto_id,
          quantidade_produto: produto.quantidade_produto,
          valor_produto: productsOrderEcxistent.valor
        })
    }

    return res.status(201).json(registeredOrder);

  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

const listOrder = async (req, res) => {
  const { cliente_id } = req.query;

  try {
    if (!cliente_id) {

      const listAllOrder = await connection("pedidos").select("*");

      const listAllOrderAndProducts = await Promise.all(
        listAllOrder.map(async (pedido) => {
          const orderProducts = await connection("pedido_produtos")
            .select("*")
            .where("pedido_id", pedido.id);

          return {
            pedido,
            pedido_produtos: orderProducts

          }
        }));
      return res.status(200).json(listAllOrderAndProducts);
    }

    const existingClient = await connection("clientes")
      .where("id", cliente_id)
      .first();

    if (!existingClient) {
      return res.status(404).json({ mensagem: "O Cliente não existe." });
    }

    const listOrderClient = await connection("pedidos")
      .select("*")
      .where("cliente_id", cliente_id);

    if (!listOrderClient.length) {
      return res.status(404).json({ mensagem: "O Cliente ainda não fez nenhum pedido." });
    }

    const listOrderAndProducts = await Promise.all(
      listOrderClient.map(async (pedido) => {
        const orderProducts = await connection("pedido_produtos")
          .select("*")
          .where("pedido_id", pedido.id);

        return {
          pedido,
          pedido_produtos: orderProducts

        }
      }));

    return res.status(200).json(listOrderAndProducts);

  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
  insertOrder,
  listOrder
};
