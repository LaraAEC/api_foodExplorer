const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) { //função para criar novo usuário
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users").where({ email: email}).first();

    if (checkUserExists) {
      throw new AppError("Este email já encontra-se em uso.");
    }

    const hashedPassword = await hash(password, 8);

    const [user_id] = await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    console.log(user_id);
    return response.status(201).json();
  }

  async update(request, response) { //função para atualizar o usuário
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id: id}).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail =  await knex("users").where({ email: email}).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

     //verificação se o usuário digitou a senha nova, mas não digitou a senha antiga
     if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
    }

    //Se existir o password e o old_password: verificar se a old_password digitada é igual a que já está cadastrada
    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword) { //se checkOldPassword der falso
        throw new AppError("A senha antiga não confere.");
      }

      //Prosseguindo e atualizando a senha, se não caiu no if() anterior
      user.password = await hash(password, 8); //usando hash pra criptografar o novo password.
    }

    await knex("users").update(user).where({ id: id});

    return response.status(201).json();

  }

}

module.exports = UsersController;