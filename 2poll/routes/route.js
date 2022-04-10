const express = require('express');
const router = express.Router();
const userController = require('../constrollers/userController')
const pollController = require('../constrollers/pollController')
// const voteController = require('../controllers/cartController')
// const channelController = require('../controllers/orderController')
// const middleware = require('../middlewares/auth')

//User's APIs -> Authentication required.
router.post('/createUser', userController.userCreation)
router.post("/login",userController.userLogin)
router.post("/createPoll", pollController.createPoll)


module.exports = router;