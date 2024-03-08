# README - API de PDV (Ponto de Venda)
## Este projeto consiste na criação de uma API para um PDV (Frente de Caixa), onde são gerenciados dados de categorias, clientes, pedidos, produtos e usuários. O sistema utiliza tecnologias como Node.js, Express, PostgreSQL, Nodemailer para envio de e-mails, e segue práticas de clean code. O projeto foi feito em equipe usando Fluxo de trabalho pelo git hub e praticas de Scrum, divisão de tarefas pelo Trello e dividido em 3 sprints.

## Tecnologias Utilizadas
**Node.js**: Plataforma de desenvolvimento backend.

**Express**: Framework web para Node.js, utilizado para facilitar a criação de APIs RESTful.

**PostgreSQL**: Banco de dados relacional utilizado para persistência dos dados.

**Nodemailer**: Módulo do Node.js para envio de e-mails.

Outras bibliotecas: As bibliotecas adicionais são mencionadas conforme necessário em cada seção.

## Banco de Dados
O projeto utiliza um banco de dados PostgreSQL chamado pdv. Um arquivo SQL contendo os comandos de criação das tabelas e inserção das categorias necessárias está disponível no projeto. Esta conectado com um banco de dados online, ElephantSQL

## Endpoints
## 1ª Sprint
## Listar Categorias
Descrição: Endpoint para listar todas as categorias cadastradas.

Método: GET

Rota: /categoria

Status Codes:

200 (OK): Requisição bem sucedida.

500 (Internal Server Error): Erro inesperado do servidor.


## Cadastrar Usuário

Descrição: Endpoint para cadastrar um novo usuário.

Método: POST

Rota: /usuario

Status Codes:

201 (Created): Requisição bem sucedida e usuário cadastrado.

400 (Bad Request): Erro de validação nos campos obrigatórios.

500 (Internal Server Error): Erro inesperado do servidor.


## Efetuar Login do Usuário

Descrição: Endpoint para login de usuário cadastrado.

Método: POST

Rota: /login

Status Codes:

200 (OK): Requisição bem sucedida e login efetuado.

400 (Bad Request): E-mail ou senha incorretos.

500 (Internal Server Error): Erro inesperado do servidor.


## Detalhar Perfil do Usuário Logado

Descrição: Endpoint para visualizar os dados do perfil do usuário logado.

Método: GET

Rota: /usuario

Status Codes:

200 (OK): Requisição bem sucedida.

500 (Internal Server Error): Erro inesperado do servidor.

## Editar Perfil do Usuário Logado

Descrição: Endpoint para editar os dados do perfil do usuário logado.

Método: PUT

Rota: /usuario

Status Codes:

200 (OK): Requisição bem sucedida e perfil atualizado.

400 (Bad Request): Erro de validação nos campos obrigatórios.

500 (Internal Server Error): Erro inesperado do servidor.

## 2ª Sprint (Continuação)

## Cadastrar Produto

Descrição: Endpoint para cadastrar um novo produto.

Método: POST

Rota: /produto

Status Codes:

201 (Created): Requisição bem sucedida e produto cadastrado.

400 (Bad Request): Erro de validação nos campos obrigatórios.

500 (Internal Server Error): Erro inesperado do servidor.


## Editar Dados do Produto

Descrição: Endpoint para atualizar informações de um produto.

Método: PUT

Rota: /produto/:id

Status Codes:

200 (OK): Requisição bem sucedida e produto atualizado.

400 (Bad Request): Erro de validação nos campos obrigatórios ou ID inválido.

500 (Internal Server Error): Erro inesperado do servidor.


## Listar Produtos

Descrição: Endpoint para listar todos os produtos cadastrados.

Método: GET

Rota: /produto

Status Codes:

200 (OK): Requisição bem sucedida.

500 (Internal Server Error): Erro inesperado do servidor.


## Detalhar Produto

Descrição: Endpoint para obter detalhes de um produto.

Método: GET

Rota: /produto/:id

Status Codes:

200 (OK): Requisição bem sucedida.

400 (Bad Request): ID inválido.

500 (Internal Server Error): Erro inesperado do servidor.


## Excluir Produto por ID

Descrição: Endpoint para excluir um produto.

Método: DELETE

Rota: /produto/:id

Status Codes:

204 (No Content): Requisição bem sucedida e produto excluído.

400 (Bad Request): ID inválido.

500 (Internal Server Error): Erro inesperado do servidor.


## Cadastrar Cliente

Descrição: Endpoint para cadastrar um novo cliente.

Método: POST

Rota: /cliente

Status Codes:

201 (Created): Requisição bem sucedida e cliente cadastrado.

400 (Bad Request): Erro de validação nos campos obrigatórios.

500 (Internal Server Error): Erro inesperado do servidor.


## Editar Dados do Cliente

Descrição: Endpoint para atualizar informações de um cliente.

Método: PUT

Rota: /cliente/:id

Status Codes:

200 (OK): Requisição bem sucedida e cliente atualizado.

400 (Bad Request): Erro de validação nos campos obrigatórios ou ID inválido.

500 (Internal Server Error): Erro inesperado do servidor.


## Listar Clientes

Descrição: Endpoint para listar todos os clientes cadastrados.

Método: GET

Rota: /cliente

Status Codes:

200 (OK): Requisição bem sucedida.

500 (Internal Server Error): Erro inesperado do servidor.


## Detalhar Cliente

Descrição: Endpoint para obter detalhes de um cliente.

Método: GET

Rota: /cliente/:id

Status Codes:

200 (OK): Requisição bem sucedida.

400 (Bad Request): ID inválido.

500 (Internal Server Error): Erro inesperado do servidor.


## 3ª Sprint (Continuação)

## Cadastrar Pedido

Descrição: Endpoint para cadastrar um novo pedido.

Método: POST

Rota: /pedido

Status Codes:

201 (Created): Requisição bem sucedida e pedido cadastrado.

400 (Bad Request): Erro de validação nos campos obrigatórios.

500 (Internal Server Error): Erro inesperado do servidor.


## Listar Pedidos

Descrição: Endpoint para listar todos os pedidos cadastrados.

Método: GET

Rota: /pedido

Status Codes:

200 (OK): Requisição bem sucedida.

500 (Internal Server Error): Erro inesperado do servidor.


## Considerações Finais

Este README descreve os principais endpoints da API de PDV, juntamente com as tecnologias utilizadas e os requisitos obrigatórios. Certifique-se de seguir as orientações de validação e tratamento de erros descritas em cada seção para garantir o correto funcionamento da aplicação. Em caso de dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe responsável.
