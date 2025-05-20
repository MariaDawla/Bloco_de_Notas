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
