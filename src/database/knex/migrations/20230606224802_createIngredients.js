//Tabela dos Ingredientes

exports.up = knex => knex.schema.createTable('ingredients', table => {
  table.increments("id"); 
  table.text("name").notNullable(); 
  
  table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");
  table.integer("user_id").references("id").inTable("users"); 
  
}); 

//DOWN - processo de deletar a tabela, passo apenas o nome da tabela
exports.down = knex => knex.schema.dropTable('ingredients'); 