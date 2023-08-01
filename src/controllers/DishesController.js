const knex = require("../database/knex");
const AppError = require('../utils/AppError');

const DiskStorage = require("../providers/DiskStorage");

const diskStorage = new DiskStorage();

class DishesController {
  //Cria os pratos
  async create (request, response) {
    const {title, description, price, category, ingredients} = request.body;
    const { filename: photo } = request.file;

    const filename = await diskStorage.saveFile(photo);
    

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
      photo: filename,
    });

    const ingredientsArray = ingredients.split(",")

     //Ingredientes sendo inseridos na tabela ingredientes em forma de objeto.
     const ingredientsInsert = ingredientsArray.map(name => {
      return { 
        dish_id, 
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert); //Passando para minha tabela Ingredientes, os ingredientes inseridos.

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
    const { filename: avatar_dish } = request.file;

    const filename = await diskStorage.saveFile(avatar_dish);
    const dish = await knex("dishes").where({ id }).first();


    if (!dish) {
      throw new AppError("Prato não encontrado.");
    }

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    dish.avatar_dish = filename ?? dish.avatar_dish;

    await knex("dishes").where({ id: dish.id}).update({
      title,
      description,
      price,
      category,
      avatar_dish: filename
    });

    await knex("ingredients").where({ dish_id: dish.id}).delete();

    const ingredientsList = ingredients.split(",");

    for (let i = 0; i < ingredientsList.length; i++) {
        const ingredient = ingredientsList[i];

        if (ingredient.id) {
            await knex("ingredients")
            .where({ id: ingredient.id })
            .update({ name: ingredient });
        } else {
            await knex("ingredients").insert({
                dish_id: dish.id,
                name: ingredient
            });
        }
    }

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
      
      .whereIn("name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.dish_id" )
      .groupBy("dishes.id") 
      .orderBy("dishes.title")

    } else if(title) {
      dishes = await knex("dishes")
      .whereLike("title", `%${title}%`)
      .orderBy("title")

    } else {
      dishes = await knex("dishes")
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


    return response.json(dishesWithIngredients);
  }
 
}

module.exports = DishesController;