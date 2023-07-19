const knex = require("../database/knex");

class FavoritesController{

  //Cria pratos favoritos
  async create (request, response) {
    const {dish_id} = request.query;
    const {user_id} = request.params;
 
    const [favorite] = await knex("favorites").insert({
      dish_id,
      user_id
    });

    console.log(favorite);
    return response.status(201).json();
  }

  //Mostra todos os pratos favoritados de um usuário
  async index (request, response) {
    const { user_id } = request.params;

    const favorites = await knex("favorites")
    .where({ user_id }) 
    .groupBy("id")

    return response.json();
  }

   //Retira o prato da lista de favoritos de um usuário
   async delete (request, response) {
    const { id } = request.params;

    await knex("favorites").where({ id }).delete();

    return response.json()
  }

}

module.exports = FavoritesController;