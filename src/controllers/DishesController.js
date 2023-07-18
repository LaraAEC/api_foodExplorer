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
      category
    });

     //Ingredientes sendo inseridos na tabela ingredientes em forma de objeto.
     const ingredientsInsert = ingredients.map(name => {
      return { 
        dish_id, 
        name
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
    const { title, ingredients } = request.query;


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
        "dishes.category"
      ])
      .whereLike("dishes.title", `%${title}%`) 
      .whereIn("name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.dish_id" )
      .groupBy("dishes.id") 
      .orderBy("dishes.title")

    } else {
      dishes = await knex("dishes")
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const allIngredients = await knex("ingredients"); 
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients =  allIngredients.filter(ingredient => ingredient.dish_id === dish.id);
      
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