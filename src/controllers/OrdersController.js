const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class OrdersController {
  async create(request, response) { 
    const { status } = request.body;
    const { user_id} = request.params;

    const order = await knex("orders").where({ email }).first(); //'first' para pegar apenas um email, e trazer os dados do usuário que possui esse email filtrado

    if(!user) { //se usuário não existir, valor Falso
      throw new AppError("E-mail e/ou senha incorreta", 401); //jogando uma exceção e tratando ela
    }

    const [ der ] = await knex("order").insert({
     user_id,
     status
    });

    return response.status(201).json();
  }

}

module.exports = OrdersController;