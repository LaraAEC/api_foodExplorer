const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class OrderItemsController {
  async create(request, response) { 
    const { amount, dish_id, price, total } = request.body;
    const { order_id} = request.body;

   

    const [ orderItem_id ] = await knex("order_items").insert({
      order_id,
      amount,
      dish_id,
      unit_price: price,
      total_price: total
    });

    return response.status(201).json();
  }

}

module.exports = OrderItemsController;