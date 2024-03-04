const connection = require("../connections/db");
const { uploadImage, deleteImage } = require("../services/uploads");
const joi = require('joi');

const insertProduct = async (req, res) => {
  const { descricao, categoria_id, quantidade_estoque, valor } = req.body;


  if (!descricao || !categoria_id || !quantidade_estoque || !valor) {
    return res.status(400).json("Todos os campos obrigatórios devem ser informados.");
  }

  if (Number(quantidade_estoque) < 1 || Number(valor) < 1) {
    return res.status(400).json("O estoque e o valor devem ser maior que 0");
  }

  try {
    const existingCategory = await connection("categorias").where("id", categoria_id).first();
    if (!existingCategory) {
      return res.status(400).json("A categoria informada não existe.");
    }

    const existingDescricao = await connection("produtos").where("descricao", descricao).first();
    if (existingDescricao) {
      return res.status(400).json("O produto já foi cadastrado.");
    }
    const produto = await connection("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .returning("*");

    return res.status(201).json(produto[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { descricao, categoria_id, quantidade_estoque, valor } = req.body;

  if (!descricao || !categoria_id || !quantidade_estoque || !valor) {
    return res.status(400).json("Todos os campos obrigatórios devem ser informados.");
  }

  if (Number(quantidade_estoque) < 0 || Number(valor) < 1) {
    return res.status(400).json("O estoque deve ser 0 ou maior e o valor maior que 0.");
  }

  try {

    const existingProduct = await connection("produtos").where("id", id).first();
    if (!existingProduct) {
      return res.status(404).json("Produto não encontrado.");
    }

    const existingCategory = await connection("categorias").where("id", categoria_id).first();
    if (!existingCategory) {
      return res.status(400).json("A categoria fornecida não existe.");
    }

    let produto = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    await connection("produtos").where("id", id).update(produto);

    if (req.file) {

      if (existingProduct.produto_imagem) {
        const imageUrl = new URL(existingProduct.produto_imagem);
        const imagePath = imageUrl.pathname.substring(1);
        console.log(imagePath)
        await deleteImage(imagePath);
      }

      const { originalname, mimetype, buffer } = req.file;

      const imagem = await uploadImage(
        `produto_imagem/${id}/${originalname}`,
        buffer,
        mimetype
      )

      produto = await connection('produtos').update({
        produto_imagem: imagem.url
      }).where({ id }).returning('*')

      produto[0].produto_imagem = imagem.url
    }

    return res.status(200).json(produto[0]);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error.message);
  }
};

const listProducts = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    let queryProducts = connection("produtos");

    if (categoria_id) {
      const existingCategory = await connection("categorias").where("id", categoria_id).first();
      if (!existingCategory) {
        return res.status(400).json("A categoria informada não existe.");
      }
      queryProducts = queryProducts.where("categoria_id", categoria_id);
    }

    const products = await queryProducts.select("*").orderBy('id', 'asc');

    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

const detailProduct = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json("É necessário informar um número de id válido.");
  }
  try {
    const existingProduct = await connection("produtos")
      .where("id", id)
      .first();
    if (!existingProduct) {
      return res.status(404).json("Produto não encontrado.");
    }
    return res.status(200).json(existingProduct);
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }
};

const verifyProductLinkedToOrder = async (produtoId) => {
  try {
    const ordersLinked = await connection('pedidos_produtos')
      .where('produto_id', produtoId)
      .select('id')
      .limit(1);

    return ordersLinked.length > 0;
  } catch (error) {
    return false;
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const productDeletionSchema = joi.object({
    id: joi.number().integer().required(),
  });

  const { error } = productDeletionSchema.validate({ id });

  if (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor." });
  }

  try {
    const existingProduct = await connection('produtos')
      .where('id', id)
      .first();

    if (!existingProduct) {
      return res.status(404).json('Produto não encontrado.');
    }

    const productIsLinked = await verifyProductLinkedToOrder(id);

    if (productIsLinked) {
      return res.status(400).json({ erro: 'Não é possível excluir o produto, pois está vinculado a um pedido.' });
    }

    if (existingProduct.produto_imagem) {
      const imageUrl = new URL(existingProduct.produto_imagem);
      const imagePath = imageUrl.pathname.substring(1);
      console.log(imagePath)
      await deleteImage(imagePath);
    }


    await connection('produtos').where('id', id).del();

    return res.status(200).json('Produto excluído com sucesso');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  insertProduct,
  updateProduct,
  listProducts,
  detailProduct,
  deleteProduct
};
