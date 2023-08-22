require("express-async-errors"); 
require("dotenv/config");

const AppError = require("./utils/AppError");

const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(cors());

app.use(express.json()); 

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER)); //buscando pelo que está dentro da pasta de uploads, na rota /files busco isso através do método static do express

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


const PORT = process.env.PORT || 2222;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
