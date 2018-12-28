const Joi = require('joi');
const __ = require('../utils/response');

class Validator {

//---------------Signup validation-------------------
  async signup (req, res, next) {
   
     const schema = Joi.object().keys({
         userName: Joi.string().alphanum().min(3).max(30).required().label('Invalid username. Must be at least 3 characters'),
         password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().label('Invalid password input'),
         email: Joi.string().trim().email().required().label('Please enter valid email'),
         phoneNumber: Joi.string().required().regex(/^\d{10}$/).label('please enter 10 digit phone number')
     })

     Joi.validate(req.body, schema, function (err, value) {
       if(err) {
          return __.customMsg(res, 400, `${err.details[0].context.label}`)
       }
       next();

      });
    }

//------------------login validation--------------
     async login (req, res, next) {  
     const schema = Joi.object().keys({
         password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().label('Invalid password input'),
         email: Joi.string().trim().email().required().label('Please enter valid email'),
     })

     Joi.validate(req.body, schema, function (err, value) {
       if(err) {
          return __.customMsg(res, 400, `${err.details[0].context.label}`)
       }
       next();

      });
    }

}

module.exports = new Validator();