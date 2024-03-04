create database pdv;

create table usuarios (
  id serial primary key,
  nome varchar(200) not null,
  email varchar(200) unique not null,
  senha varchar(200) not null
);

create table categorias (
  id serial primary key,
  descricao text not null
);

insert into categorias
(descricao)
values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games')

create table produtos (
  id serial primary key,
  descricao text not null,
  quantidade_estoque int not null,
  valor int not null,
  categoria_id int not null references categorias(id)
)

create table clientes (
  id serial primary key,
  nome varchar(250) not null,
  email varchar(250) not null unique,
  cpf varchar(11) not null unique,
  cep varchar(8),
  rua varchar(250),
  numero varchar(50),
  bairro varchar(250),
  cidade varchar(250),
  estado varchar(250)
)

alter table produtos add column produto_imagem varchar;

create table pedidos (
  id serial primary key,
  cliente_id int not null references clientes(id),
  observação text,
  valor_total int not null
)

create table pedido_produtos (
  id serial primary key,
  pedido_id int not null references pedidos(id),
  produto_id int not null references produtos(id),
  quantidade_produto int not null,
  valor_produto int not null
)
