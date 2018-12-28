const express = require('express');
const Router = express.Router();

const userController = require('../controller/userController');
const validate = require('../middleware//validator')

// For development - To log all incoming req.body for all Routes
// Will be removed in production
Router.all('*', (req, res, next) => {
    console.log("Incoming Request at: ", new Date(), ": " , req.body);
    next();
});

Router.post('/createUser', validate.signup, userController.createUser);

Router.post('/login', validate.login, async (req, res, next) => {
 userController.userLogin(req, res);
});

Router.get('/verify', async (req, res, next)=>{
 userController.verifyEmail(req, res);
})

module.exports = Router

