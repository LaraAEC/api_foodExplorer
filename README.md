
# RocketFood ![restaurant](https://cdn-icons-png.flaticon.com/128/2311/2311475.png)
A comprehensive application that simulates a virtual restaurant menu. It features two types of personas: the restaurant administrator and the user (customer).
This frontend application is 
Sua arquitetura limpa, baseada em Controllers para a realização dos métodos pertinentes às rotas, traz clareza e fácil entendimento.
Essa API backend foi desenvolvida com o objetivo de ser amplamente consumida por um frontend ou qualquer outra aplicação que deseje acessar as informações armazenadas no banco de dados utilizado.
Ela consome todos os dados de um Banco de Dados SQLite de modo a entregar as imagens dos pratos, assim como seus dados, descrição, preço, categoria...Entrega, ainda, os dados de seus usuários cadastrados, bem como faz o cadastro de seus usuários e dos pratos desejados pelo administrador do restaurante. 

## Fundamentos
- Lógica de Negócios: Contém toda a lógica de negócios da necessária para entregar as informações solicitadas pelo Frontend. Isso inclui processar dados, executar cálculos, aplicar regras de negócios e determinar como os diferentes componentes da aplicação interagem entre si.

- Gerenciamento de Dados: Gerencia o acesso aos dados do aplicativo, através de um banco de dados SQLite. Entregando consultas, atualizações, inserções e exclusões de dados.

- Validação de Dados: Esta API deve valida os dados de entrada para garantir que eles estejam corretos, coerentes e seguros através do SessionsController.

- Autenticação e Autorização: Implementação de sistema de autenticação e autorização para controlar quem pode acessar quais recursos e funcionalidades. Isso devido às duas 'personas' que podem fazer solicitações/requisições na Interface. Isso inclui a geração e validação de tokens de autenticação, verificação de permissões e proteção contra acessos não autorizados através de Middleware.

- Formatação de Respostas: Formata as respostas em JSON. Ela também define os códigos de status HTTP apropriados para indicar o resultado da solicitação.

- Tratamento de Erro: Facilitação nos erros com a classe chamada AppError, que é usada para criar objetos de erro personalizados. 

- Roteamento e Endpoints: Define rotas e endpoints claros para diferentes recursos e funcionalidades. Cada endpoint corresponde a um recurso específico e é responsável por lidar com solicitações relacionadas a esse recurso.

- Logs: Código devidamente versionado com o GIT para rastreamento de atividades e diagnosticar possíveis problemas.

- Segurança: Proteção dos dados através da utilização de variáveis de ambiente, arquivo '.env'.

# Funcionalidades e Controllers:
Aplicação Backend baseada no acolhimento das rotas pelos Controllers. Cada rota leva a um controller diferente, isso de acordo com o que foi solicitado via requisição HTTP do frontend.
E, através dos Controllers trabalham-se as regras de negócio, o tratamento dos dados e a devolução das respostas adequadas.
Dentro de cada Controller respeitou-se as operações básicas do acrônimo 'CRUD', havendo no máximo 5 métodos em cada Controller, sem repetição de método, a fim de alcançar um código bem estruturado.

## DishesController:
Gerencia as operações relacionadas a pratos em uma aplicação. As operações incluem criar, mostrar detalhes, atualizar e deletar pratos, além de listar pratos existentes com filtros de pesquisa.

- Criação de Prato:
Aceita uma requisição HTTP POST com informações do prato, incluindo título, descrição, preço, categoria, ingredientes e foto.
Salva a imagem usando um provedor de armazenamento em disco.
Insere os detalhes do prato e seus ingredientes no banco de dados.

- Mostrar Detalhes do Prato:
Aceita uma requisição HTTP GET com o ID do prato.
Recupera os detalhes do prato e seus ingredientes correspondentes do banco de dados.
Retorna os detalhes do prato, incluindo seus ingredientes, como uma resposta JSON.

- Atualização de Prato:
Aceita uma requisição HTTP PUT com o ID do prato e informações atualizadas.
Atualiza os detalhes do prato no banco de dados, incluindo a possibilidade de atualizar a imagem.
Atualiza os ingredientes associados ao prato.

- Exclusão de Prato:
Aceita uma requisição HTTP DELETE com o ID do prato.
Remove o prato do banco de dados.

- Listagem de Pratos:
Aceita uma requisição HTTP GET para listar pratos.
Aceita parâmetros de consulta para filtrar por título e/ou ingredientes.
Retorna uma lista de pratos do banco de dados, possivelmente filtrada por título ou ingredientes.
Inclui detalhes de ingredientes para cada prato na resposta JSON.

O controlador utiliza a biblioteca Knex para interagir com o banco de dados, além de um provedor de armazenamento em disco para gerenciar as imagens dos pratos. Ele também lida com alguns cenários específicos, como atualização de ingredientes e busca de pratos com base em ingredientes.

## FavoritesController:
Lida com operações relacionadas a favoritos de pratos em uma aplicação. Ele tem funções para criar, listar, mostrar detalhes e remover pratos favoritos para um usuário específico.

- Create: Cria um novo favorito para um prato. Ele verifica se o usuário existe, se o prato existe e, em seguida, insere um registro na tabela de favoritos.

- index: Lista todos os pratos favoritos de um usuário. Ele junta as tabelas de favoritos e pratos usando um INNER JOIN e retorna uma lista de pratos favoritos do usuário.

- show: Mostra os detalhes de um prato favorito específico do usuário. Ele combina as tabelas de favoritos e pratos usando um INNER JOIN e retorna os detalhes do prato favorito solicitado.

- delete: Remove um prato favorito específico pelo ID do prato.

Este controlador usa a biblioteca Knex para interagir com o banco de dados e também verifica a existência do usuário e do prato antes de executar as operações. Ele fornece uma interface para gerenciar a coleção de pratos favoritos de um usuário.

## IngredientsController:
Responsável por lidar com operações relacionadas aos ingredientes de um prato. Ele tem uma função chamada index que lista os ingredientes de um prato específico.

- index: Aceita uma requisição HTTP GET com o dish_id (ID do prato) como parâmetro nos parâmetros da requisição. Ele usa o dish_id para buscar os ingredientes relacionados a esse prato no banco de dados. Os ingredientes são obtidos usando o método where com base no dish_id e, em seguida, agrupados pelo nome usando o groupBy.

Retorna uma resposta JSON contendo a lista de ingredientes.

O controlador utiliza a biblioteca Knex para interagir com o banco de dados e, neste caso, a função index é usada para obter a lista de ingredientes associados a um prato específico.

## OrderItemsController:
Responsável por lidar com a criação de itens de pedido em uma aplicação. Ele aceita um conjunto de itens e um ID de pedido e insere esses itens na tabela de itens de pedido.

- create: Aceita uma requisição HTTP POST com o corpo da requisição contendo os items (itens de pedido) e o order_id (ID do pedido) que o pedido pertence.
Ele verifica se o pedido com o ID fornecido existe na tabela de pedidos.
Caso o pedido não exista, ele lança um erro utilizando a classe AppError.
Mapeia os items recebidos para o formato que será inserido na tabela de itens de pedido.
Insere os itens na tabela de order_items.
É responsável por receber os itens de um pedido e associá-los ao pedido específico na tabela de order_items. Ele verifica a existência do pedido e depois insere os itens no banco de dados.

## OrdersController:
 Responsável por lidar com operações relacionadas a pedidos em uma aplicação. Ele abrange funções para criar, mostrar detalhes, listar, atualizar e deletar pedidos.

- create: Cria um novo pedido para um usuário. Ele verifica se o usuário está logado, obtém o horário atual em São Paulo (usando a biblioteca moment-timezone) e insere um novo pedido com o ID do usuário e as datas de criação/atualização.

- show: Mostra detalhes dos pedidos de um usuário específico. Ele junta as tabelas de pedidos e itens de pedido usando INNER JOIN e retorna detalhes dos pedidos, incluindo os itens relacionados.

- index: Lista todos os pedidos existentes com detalhes dos itens. Ele junta as tabelas de pedidos e itens de pedido usando INNER JOIN e retorna detalhes de todos os pedidos, incluindo os itens relacionados.

- update: Atualiza o status de um pedido específico. Ele verifica se o pedido existe e atualiza o status.

- delete: Remove um pedido específico pelo ID do pedido.

Lida com todas as operações relacionadas a pedidos e seus itens associados. Ele utiliza a biblioteca Knex para interagir com o banco de dados e a biblioteca moment-timezone para manipular datas e horários em diferentes fusos horários.

## SessionsController:
Responsável por lidar com operações relacionadas à autenticação e criação de sessões de usuário.

- create: Cria uma nova sessão de usuário (login). Ele recebe o e-mail e senha do corpo da requisição.
Verifica se um usuário com o e-mail fornecido existe no banco de dados.
- Se o usuário não existir, lança um erro usando a classe AppError.
- Compara a senha fornecida com a senha criptografada do usuário usando o método compare do bcryptjs.
- Se a senha não coincidir, lança um erro usando a classe AppError.
- Obtém a chave secreta e o tempo de expiração do token a partir das configurações de autenticação.
- Cria um token JWT assinado contendo o ID do usuário como conteúdo e tempo de expiração.
Retorna o usuário e o token como resposta.

Esse controlador é responsável por autenticar os usuários, comparando suas senhas criptografadas e gerando tokens JWT para as sessões ativas. Ele utiliza a biblioteca Knex para interagir com o banco de dados, a biblioteca bcryptjs para comparar senhas criptografadas e a biblioteca jsonwebtoken para criar e assinar tokens JWT.

## UsersController:
Responsável por lidar com operações relacionadas aos usuários, como criar e atualizar informações do usuário.

- create: Cria um novo usuário.

Verifica se um usuário com o e-mail fornecido já existe no banco de dados.
Se o usuário já existir, lança um erro.
Criptografa a senha fornecida usando hash do bcryptjs.
Insere o novo usuário no banco de dados.
Retorna um status 201 (Created) como resposta.

- update: Atualiza as informações do usuário.
Obtém o ID do usuário autenticado.
Busca o usuário pelo ID.
Verifica se outro usuário já possui o e-mail atualizado e lança um erro, se necessário.
Atualiza o nome e o e-mail do usuário, se fornecidos.
Verifica se a nova senha foi fornecida sem a senha antiga e lança um erro, se necessário.
Compara a senha antiga fornecida com a senha atual do usuário.
Se a senha antiga coincidir, criptografa a nova senha usando hash do bcryptjs.
Atualiza os dados do usuário no banco de dados.
Retorna um status 201 (Created) como resposta.

Este controlador é responsável por lidar com a criação de novos usuários, garantindo que os e-mails sejam únicos e criptografando as senhas. Também lida com a atualização das informações do usuário, incluindo a possibilidade de atualizar a senha com verificação da senha antiga.

# Code Versioning
- Git
- Github

# Technologies Used
- NodeJs
- Express
- API RESTfull
- Knex
- Database relational (SQLite)
- Multer 
- JWT Token
- Cors

# Usage Guidelines
- To install the project dependencies and initiate its functionality, execute the command npm i or yarn i in the terminal. It's important to run this command to ensure that all necessary dependencies are installed correctly.

- Para inicializar as tabelas do banco de dados execute o comando "npm run migrate".

- The administrator and the user are identified through the isAdmin logic developed in the backend to be consumed. This logic returns a boolean value; if it's "1," it indicates an administrator, and if it's "0," it signifies a user. This value should already be configured directly in the database, with "1" indicating an administrator role.

-Para realizar as requisições no insomnia é necessário usar nos parâmetros o seguinte endereço, http://localhost:2222/"nome da tabela" podendo ser [users, sessions, dishes, requests, items_requests, category, files, favorites] de acordo com a tabela que será feita a modificação.

# Previews





## 🔗 Links
[![deploy](https://img.shields.io/badge/deploy-00BFFF?style=for-the-badge&logo=cloud&logoColor=white)](https://rocketfood-api-im2b.onrender.com)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/larissa-adler-ewertoncoelho1000)


