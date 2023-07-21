const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");



class DishPhotoController {
  async update(request, response){
    const { id } = request.params; //buscando o id do prato
    const dishPhotoFileName = request.file.filename; //buscando o arquivo que foi mandado pelo admin, que ele fez o upload para ser a foto do prato
    
    const diskStorage = new DiskStorage();
    
    const dish = await knex("dishes") //ir na tabela 'dishes'
    .where({ id }).first()

    if(!dish) { //verificando se o parto existe, após a busca acima se ela der errado preciso tratá-la
      throw new AppError("Prato inexistente.", 401);
	  }

    if(dish.photo){ //verificando se dentro do prato já existe uma imagem no campo photo, e se existe deletando
      await diskStorage.deleteFile(dish.photo); //usando a função deleteFile da classe diskStorage passando como parâmetro o que desejo deletar
    }

    const filename = await diskStorage.saveFile(dishPhotoFileName); //salvando a foto que foi feita upload e guardando nessa constante
    dish.photo = filename; //alterando meu campo photo

    await knex("dishes").update(dish).where({ id }); //salvando no BD, atualizando meu BD

    return response.json(dish); //retornando o usuário com a imagem já atualizada

  } 
}

module.exports = DishPhotoController;

