//Tabela de pratos
exports.up = knex => knex.schema.createTable('dishes', table => {
  table.increments("id"); 
  table.text("title"); 
  table.text("description");
  table.text("photo").default(null); 
  table.text("price").notNullable(); 
  table.text("category").notNullable();

  table.integer("user_id").references("id").inTable("users");

  table.timestamp("created_at").default(knex.fn.now()); //campo tipo timestamp chamado de created_at, com padrão usando uma função do knex que dá o tempo atual
  table.timestamp("updated_at").default(knex.fn.now()); //campo tipo timestamp chamado de updated_at, com padrão usando uma função do knex que dá o tempo atual
}); 

//DOWN - (comando migrations) processo de deletar a tabela, passo apenas o nome da tabela
exports.down = knex => knex.schema.dropTable('dishes'); 
