# 📝 Bloco de Notas Web

O Bloco de Notas Web é um espaço digital para você organizar suas ideias, pensamentos e lembretes.
Nele, você pode criar **janelas**, como se fossem pastas, e dentro delas guardar suas **páginas**, onde anota o que quiser.

É como um caderno virtual, mas muito mais organizado — perfeito para quem adora separar tudo por tema ou projeto! 💡✨

---

## 🚀 Funcionalidades

- Criar novas janelas
- Adicionar páginas a janelas existentes
- Listar todas as janelas com suas respectivas páginas
- Editar o título de uma janela
- Editar a página, incluindo título, tipo e corpo
- Marcar janelas e páginas como deletadas (soft delete)
- Visualizar uma janela específica com suas páginas
- Mover uma página para outra janela

---

## 🛠️ Tecnologias Utilizadas

- **Java Script** + **Node.js** + **Express** – Back-end da aplicação
- **PostgreSQL** – Banco de dados relacional
- **Docker** – Uso de containers
- **pg (node-postgres)** – Cliente Node.js para PostgreSQL
- **React** + **HTML** + **CSS** - Front-end da aplicação

---

## 🐳 Configuração com Docker (somente o banco de dados)

1. Crie uma **rede Docker**:

```bash
docker network create bloco-notas-net
```

---

## ⚙️ Como rodar o projeto:

- Clone o repositório:
```bash
git clone https://github.com/MariaDawla/Bloco_de_Notas.git
```
- Configure a conexão com o banco no arquivo .env
```bash
user = seu_user
host = seu_host
database = seu_database
password = sua_senha
port = sua_port
```
- Inicie o Front-end do projeto
```bash
cd ./Frontend
npm i
npm start
```
---

## 🎲 Script do banco de dados
```bash
CREATE TABLE Pagina 
( 
 id SERIAL PRIMARY KEY,  
 titulo TEXT,  
 conteudo TEXT,  
 tipo TEXT,  
 id_janela INT,  
 data_criacao DATE,  
 data_delecao DATE, 
 FOREIGN KEY (id_janela) REFERENCES Janela(id) ON DELETE CASCADE
); 

CREATE TABLE Janela 
( 
 id SERIAL PRIMARY KEY,
 titulo TEXT,
 data_criacao DATE,
 data_delecao DATE
); 

CREATE TABLE pagina_janela 
( 
 id_janela INT,  
 id_pagina INT,  
 id INT PRIMARY KEY,
 FOREIGN KEY (id_janela) REFERENCES Janela(id) ON DELETE CASCADE,
 FOREIGN KEY (id_pagina) REFERENCES Pagina(id) ON DELETE CASCADE
); 

```

  



