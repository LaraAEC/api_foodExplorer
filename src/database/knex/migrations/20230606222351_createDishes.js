//Tabela de pratos
exports.up = knex => knex.schema.createTable('dishes', table => {
  table.increments("id"); 
  table.text("title"); 
  table.text("description");
  table.text("photo").default(null); 
  table.decimal("price", 6, 2); 
  table.text("category").notNullable();
}); 

//DOWN - (comando migrations) processo de deletar a tabela, passo apenas o nome da tabela
exports.down = knex => knex.schema.dropTable('dishes'); 
