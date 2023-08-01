const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated"); //import do middleware de autenticação

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.post("/", favoritesController.create); 
favoritesRoutes.get("/", favoritesController.index);
favoritesRoutes.get("/:id", favoritesController.show);
favoritesRoutes.delete("/:id", favoritesController.delete);


module.exports = favoritesRoutes;