require("express-async-errors"); //importada antes de tudo,biblioteca que lida com erros

const AppError = require("./utils/AppError");

const express = require("express");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use(routes);


app.use((error, request, response, next) => { //Capturando o erro, a requisição, a resposta e o next(precisa ser nessa ordem)
  //verificando se o o erro é do mesmo tipo do app error, que eu sei qual é pois eu quem fiz, lado do cliente feito lá na pasta utils
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }
    console.error(error); //para conseguir debugar o erro, caso eu precise.
    return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });

});


const PORT = 2222;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
