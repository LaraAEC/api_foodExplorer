const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated"); //import do middleware de autenticação


const favoritesRoutes = Router();

const favoritesController = new FavoritesController();


favoritesRoutes.post("/", ensureAuthenticated, favoritesController.create); 
favoritesRoutes.get("/", ensureAuthenticated, favoritesController.index);
favoritesRoutes.delete("/:id", favoritesController.delete);


module.exports = favoritesRoutes;