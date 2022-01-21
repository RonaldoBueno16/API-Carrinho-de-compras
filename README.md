# Instalação do projeto

### Requisitos

- Docker (<link>https://www.docker.com/products/docker-desktop</link>)

## Instalação

#### 1 - Clonar o repositório: <code>git clone https://github.com/RonaldoBueno16/Loja-Integrada.git</code>
#### 2 - Iniciar o banco de dados, dentro da pasta raiz do projeto(.../Loja Integrada) USE:
<code>docker build -t mysql-image -f ${pwd}/db/Dockerfile .</code></br>
<code>docker run --rm --name=mysql-container --env MYSQL_ROOT_PASSWORD=lojaintegrada --detach --publish 3306:3306 mysql</code>
#### 3 - Popular o banco de dados com os dados iniciais:
###### NO POWERSHELL: <code>cmd /c "docker exec -i mysql-container mysql -uroot -plojaintegrada < script.sql"</code>

#### 4 - Iniciar a API, dentro da pasta raiz do projeto(.../Loja Integrada) USE:
<code>docker build -t api_carrinho ${pwd}/api/</code></br>
<code>docker run --rm --name=api-carrinho --detach --link mysql-container --publish 3000:3000 api_carrinho</code></br>

# API
  
### Autorização
  
Todas as requisições da API referente ao carrinho de compras, exigem o uso de um Bearer Token. Você pode encontrar esse token fazendo o login na sua conta de usuário.
Para autenticar uma solicitação dos metodos do carrinho de compra, você deve fornecer sua chave de API no <code>Authorization</code> do tipo <code>Baerer Token</code>.
  
### Respostas de erros
  
Quando uma requisição falha por algum motivo, ela sempre enviará um JSON informando o que está errado na requisição:
  
| Codigo do erro | Erro | Razão |
| :---: | :---: | :---: |
| 1 | INVALID_JSON | Quando o usuário envia um JSON inválido |
| 2 | SERVER_NOT_RESPOND | Quando ocorre algum erro de servidor |
| 3 | NOTFOUND | Quando não conseguiu encontrar nada |
| 4 | AUTH_FAILURE | Usuário não autenticado |
| 5 | PRODUCT_ERRORS | Quando ocorre um ou mais erro em uma <code>array</code> de produtos |
| 6 | NOT_EXISTS_IN_STOCK | Quando algum produto não existe no estoque |
| 7 | QUANTIFY_OF_STOCK | Quando ocorre algum erro relacionado a quantidade de produtos no estoque |
| 8 | PRODUCT_DUPLICATED | Quando há produtos duplicados |
| 9 | INVALID_CUPOM | Quando o cupom está inválido |
| 10 | ELEMENT_REFUSED | Quando é enviado um elemento inválido à uma array de produtos |
| 11 | PRODUCT_NOT_BELONG_USER | Quando o produto não pertence ao carrinho do usuário |
  
## Rotas
  ### Cadastro de usuários
  `[POST] - /api/v1/cadastro`
  
  Content-Type: application/JSON
    
  Body Request:
  ```json
  {
    "email": "example@hotmail.com",
    "password": "example_password"
  }
  ```
  
  Response:
  ```json
  {
    "success": true,
    "message": "Usuário cadastrado com sucesso!"
  }
  ```
  
  Possíveis erros:
  | Codigo do erro | Erro | Razão |
  | :---: | :---: | :---: |
  | 1 | INVALID_JSON | Quando o usuário envia um JSON inválido |
  | 2 | SERVER_NOT_RESPOND | Quando ocorre algum erro de servidor |
  
