# API de Carrinho - Desafio Loja Integrada

### Requisitos

- Docker (<link>https://www.docker.com/products/docker-desktop</link>)

## Preparação do ambiente

#### 1 - Clonar o repositório: <code>git clone https://github.com/RonaldoBueno16/Loja-Integrada.git</code>
#### 2 - Iniciar o banco de dados, dentro da pasta raiz do projeto(.../Loja Integrada) USE:
<code>docker build -t mysql-image -f ${pwd}/db/Dockerfile .</code></br>
<code>docker run -d --rm --name=mysql-container --env MYSQL_ROOT_PASSWORD=lojaintegrada --detach --publish 3306:3306 mysql</code>
#### 3 - Popular o banco de dados com os dados iniciais:
###### OBS: Deve aguardar um delay de 10 segundos para dar tempo do banco de dados iniciar
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
  ##### Metodo utilizado para cadastrar um novo usuário ao banco de dados.
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
  
  ### Autenticação de login (TOKEN)
  `[POST] - /api/v1/login`
  ##### Metodo utilizado para autenticar o usuário e obter um token válido
  Content-Type: application/JSON
    
  Body Request:
  ```json
  {
    "email": "example@hotmail.com",
    "password": "example_password"
  }
  ```
  
  Response:
  ```
  Sucesso:
  {
    "success": true,
    "auth": true,
    "message": "Usuário logado com sucesso!",
    "token": "token"
  }
  Falha:
  {
    "success": false,
    "auth": false,
    "message": "Não foi possível encontrar uma conta com essas credenciais",
    "token": null,
    "errortype": {
        "id": 3,
        "name": "NOT_FOUND"
    }
}
  ```
  ### Trazer todos os produtos do banco de dados
  `[GET] - /api/v1/produtos`
  ##### Metodo utilizado para trazer todos os produtos da loja e obter o produto_id.
  
  Request:
  <code>NULL</code>
  
  Response:
  ```
  {
    "success": true,
    "products": [
        {
            "id": id_do_produto,
            "nome": nome_do_produto,
            "preco": preco_do_produto,
            "estoque": quantidade_do_produto_no_estoque,
            "descricao": descricao,
            "disponivel": se_o_produto_esta_disponivel,
            "createdAt": disponivel_desde,
            "updatedAt": ultima_att_nos_precos
        }
    ]
}
  ```
  ### Buscar o carrinho do cliente
  `[GET] - /api/v1/carrinho/`
  ##### Metodo utilizado para recuperar o carrinho do cliente, gerenciar totais, subtotais e mostrar o cupom
  Request:
  <code>Authorization -> Bearer Token</code>
  
  Exemple Response:
  ```json
  {
      "success": true,
      "cupom": null,
      "cupom_percent": null,
      "num_produtos": 1,
      "carrinho_id": 3,
      "total": 101,
      "subtotal": 101,
      "itens_carrinho": [
          {
              "produto_id": 1,
              "nome": "Jaleco",
              "descricao": "Jaleco de alta qualidade para atender aos clientes mais exigentes",
              "preco": 101,
              "quantidade": 1,
              "disponivel": true,
              "observacao": null
          }
      ]
  }
  ```
  
  ### Adicionar item no carrinho
  `[POST] - /api/v1/carrinho/inserir_item/`
  ##### Metodo utilizado para adicionar um item novo ao carrinho
  
  Request:
  <code>Authorization -> Bearer Token</code></br></br>
  <code>Content-Type: application/json (BODY)</code>
  ```
  {
    "carrinho_id": id_carrinho,
    "produtos": [
        {
            "produto_id": id_do_produto,
            "quantidade": quantidade_desse_produto
        }
    ]
  }
  ```
  
  Response:
  ```
  Retorna o carrinho do usuário com todos os itens - Identico ao retorno do Buscar o carrinho do cliente
  ```
  
  ### Atualizar carrinho
  `[PUT] - /api/v1/carrinho/atualizar/`
  ##### Metodo utilizado tanto para acrescentar / remover itens do carrinho ou adicionar cupom ao carrinho
	
  Request:
  <code>Authorization -> Bearer Token</code></br></br>
  <code>Content-Type: application/json (BODY)</code>
  ```javascript
  {
    "carrinho_id": id_do_carrinho,
    "cupom": codigo, //(opcional)
    "produtos": [//opcional
        {
            "produto_id": id_do_produto,
            "quantidade": quantidade_do_item_no_carrinho
        }
    ]
}
  ```
  
  Response:
  ```
  Retorna o carrinho do usuário com todos os itens - Identico ao retorno do Buscar o carrinho do cliente
  ```
	
	Cupons disponíveis para uso:
	LOJAINTEGRADA_5
	LOJAINTEGRADA_10
	LOJAINTEGRADA_15
	LOJAINTEGRADA_20
	LOJAINTEGRADA_25
	LOJAINTEGRADA_30
	

  
  ### Limpar carrinho
  `[DELETE] - /api/v1/carrinho/limpar/`
  ##### Metodo utilizado para limpar todos os produtos do carrinho do cliente.
  
  Request:
  <code>Authorization -> Bearer Token</code></br></br>
  <code>Content-Type: application/json (BODY)</code>
  ```javascript
  {
    "carrinho_id": id_do_carrinho,
}
  ```
  
  Response:
  ```
  {
    "success": true,
    "message": "Carrinho limpo com sucesso!",
    "cupom": null,
    "cupom_percent": null,
    "num_produtos": 0,
    "carrinho_id": 2,
    "total": 0,
    "subtotal": 0,
    "itens_carrinho": []
}
  ou
{
	"success": false,
	"errortype": {
		"id": 3,
		"name": "NOTFOUND"
	},
	"message": "O carrinho já está vazio!"
}
  ```
