const express = require("express");
const categorias = require('../controllers/categorias');
const usuarios = require("../controllers/users");
const login = require("../controllers/login");
const produtos = require("../controllers/products");
const clientes = require("../controllers/clients");
const pedidos = require("../controllers/order");
const verifyLogin = require("../middleware/verifyLogin");
const multer = require('../middleware/multer')

const routes = express();
routes.get("/categoria", categorias.listCategories);
routes.post("/usuario", usuarios.insertUser);
routes.post("/login", login.login);
routes.use(verifyLogin);
routes.get("/usuario", usuarios.detailUserProfile);
routes.put("/usuario", usuarios.editUserProfile);
routes.post("/produto", multer.single('produto_imagem'), produtos.insertProduct);
routes.put("/produto/:id", multer.single('produto_imagem'), produtos.updateProduct);
routes.get("/produto", produtos.listProducts);
routes.get("/produto/:id", produtos.detailProduct);
routes.delete("/produto/:id", produtos.deleteProduct);
routes.post("/cliente", clientes.insertClient);
routes.put("/cliente/:id", clientes.updateClient);
routes.get("/cliente", clientes.listClients);
routes.get("/cliente/:id", clientes.detailClient);
routes.post("/pedido", pedidos.insertOrder);
routes.get("/pedido", pedidos.listOrder);

module.exports = routes;
