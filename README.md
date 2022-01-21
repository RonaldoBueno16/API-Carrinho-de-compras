# API de carrinho de compras

### Requisitos

- Docker (<link>https://www.docker.com/products/docker-desktop</link>)

## Instalação

#### 1 - Clonar o repositório: <code>git clone https://github.com/RonaldoBueno16/Loja-Integrada.git</code>
#### 2 - Iniciar o banco de dados, dentro da pasta raiz do projeto(.../Loja Integrada) USE:
<code>docker build -t mysql-image -f ${pwd}/db/Dockerfile .</code></br>
<code>docker run --rm --name=mysql-container --env MYSQL_ROOT_PASSWORD=lojaintegrada --detach --publish 3306:3306 mysql</code>
#### 3 - Popular o banco de dados com os dados iniciais:

#### 4 - Iniciar a API, dentro da pasta raiz do projeto(.../Loja Integrada) USE:
<code>docker build -t api_carrinho ${pwd}/api/</code></br>
<code>docker run --rm --name=api-carrinho --detach --link mysql-container --publish 3000:3000 api_carrinho</code></br>

## Documentação
