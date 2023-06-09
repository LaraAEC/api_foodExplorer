const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const dishesRoutes = Router();

const dishesController = new DishesController();

dishesRoutes.get("/", dishesController.index);
dishesRoutes.post("/:user_id", dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.put("/:id", dishesController.update);
dishesRoutes.delete("/:id", dishesController.delete);


module.exports = dishesRoutes;