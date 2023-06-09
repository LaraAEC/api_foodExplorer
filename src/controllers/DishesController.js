const knex = require("../database/knex");

class DishesController {
  //Cria os pratos
  async create (request, response) {
    const {title, description, ingredients, price, category} = request.body;
    const { user_id } = request.params

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
      user_id
    });

     //Ingredientes sendo inseridos na tabela ingredientes em forma de objeto.
     const ingredientsInsert = ingredients.map(name => {
      return { 
        dish_id, 
        name,
        user_id
      }
    });

    await knex("ingredients").insert(ingredientsInsert); //Passando para minha tabela Tags, as tags inseridas; e será inserida essa informação.

    return response.json();

  }

  //Mostra detalhes do prato selecionado
  async show (request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    const ingredients = await knex("ingredients").where({dish_id: id}).orderBy("name");

    return response.json({
      ...dish,
      ingredients
    });

  }

  //Atualiza o prato selecionado
  async update (request, response) { 
    const { title, description, ingredients, price, category } = request.body;
    const { id } = request.params;

    const dish = await knex("dishes").where({ id: id}).first();


    if (!dish) {
      throw new AppError("Prato não encontrado");
    }

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    await knex("dishes").update(dish).where({ id: id});

    return response.status(201).json();
  }

  //Deleta o prato selecionado
  async delete (request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json()
  }

  //Lista todos os pratos existentes
  async index (request, response) {
    const { title, user_id, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
      dishes = await knex("ingredients")
      .select([
        "dishes.id",
        "dishes.title",
        "dishes.description",
        "dishes.photo",
        "dishes.price",
        "dishes.category",
        "dishes.user_id"
      ])
      .where("dishes.user_id", user_id ) 
      .whereLike("dishes.title", `%${title}%`) 
      .whereIn("name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.dish_id" ) 
      .orderBy("dishes.title")

    } else {
      dishes = await knex("dishes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const userIngredients = await knex("ingredients").where({ user_id }); 
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients =  userIngredients.filter(ingredient => ingredient.dish_id === dish.id);
      
      return {
        ...dish,
        ingredients: dishIngredients
      }
    });

    //AQUI AINDA PRECISO RETORNAR A PHOTO

    return response.json(dishesWithIngredients);
  }
 
}

module.exports = DishesController;