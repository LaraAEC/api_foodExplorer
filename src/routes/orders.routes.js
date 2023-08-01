const { Router } = require("express");


const OrdersController = require("../controllers/OrdersController");
const ordersController = new OrdersController();

const ordersRoutes = Router();
ordersRoutes.post("/", ordersController.create);

module.exports = ordersRoutes;