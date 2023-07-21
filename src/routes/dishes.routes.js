const { Router } = require("express");

const multer = require("multer"); //importando o multer
const uploadConfig = require("../configs/upload"); // importando minhas configurações de upload, arquivo upload.js na pasta de configurações

const DishesController = require("../controllers/DishesController");

const DishPhotoController = require("../controllers/DishPhotoController");

const dishesRoutes = Router();

//Inicializando o multer dentro de uma constante chamada upload
const upload = multer(uploadConfig.MULTER); //A Biblioteca multer foi guardada na constante MULTER lá em seu arquivo de origem para que aqui pudéssemos selecionar outra biblioteca, se necessário, que também seria configurada lá em outra constante.

const dishesController = new DishesController();

const dishPhotoController = new DishPhotoController();

dishesRoutes.get("/", dishesController.index);
dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.put("/:id", dishesController.update);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.patch("/photo/:id", upload.single("photo"), dishPhotoController.update)


module.exports = dishesRoutes;