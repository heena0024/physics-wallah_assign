const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartCntroller')
const orderController = require('../controllers/orderController')
const reviewController = require('../controllers/reviewController')
const wishListController = require('../controllers/wishListController')
const middleware= require('../middle/middle')
//User's APIs -> Authentication required.
router.post('/register', userController.userCreation)
router.post("/login", userController.userLogin)
router.post("/productCreate",middleware.userAuth, productController.productCreation)
router.get("/getProduct/:productId", middleware.userAuth, productController.getProductsById)
router.post("/cartCreate/:userId", middleware.userAuth, cartController.cartCreation)
router.post("/orderCreate/:userId", middleware.userAuth, orderController.orderCreation)
router.post("/Createreview/:productId", middleware.userAuth, reviewController.createReview)
router.post("/wishListCreate/:userId", middleware.userAuth, wishListController.createWishList)


module.exports = router;