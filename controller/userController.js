'use strict'

//-----Models-----
const UserModel = require('../models/users');


//---------Dependencies---------
const __ = require('../utils/response');
const jwt = require('../middleware/authentication');
const helper = require('../helper/helper');


class userAuthentication {
    
    async createUser(req, res) {
     try {
          let duplicateEmail = await UserModel.find({ email: req.body.email }).countDocuments();
          if ( duplicateEmail ) return __.customMsg(res, 406, `Email Id: ${req.body.email} already exists`);
          
          let userObj = {
           userName : req.body.userName,
           phoneNumber: req.body.phoneNumber,
           email: req.body.email,
           password: req.body.password
          }

          let newUser = new UserModel(userObj);
          newUser.password = newUser.generateHash(req.body.password);
          let createUser = await newUser.save();

          createUser = createUser.toObject();
          let token = await jwt.createToken(createUser._id);
          createUser.token = token;

          helper.sendMail(createUser); // Calling asyncronous

          // Delete unwanted keys from createUser object
          delete createUser['password'];
          delete createUser['updatedAt'];
          delete createUser['createdAt'];
          delete createUser['__v'];
          delete createUser['isDeleted'];
          delete createUser['isEmailVerified'];
          delete createUser['_id'];


          if(!createUser) return __.customMsg(res, 503, 'Service not available');
          if(createUser) return __.successMsg(res, createUser, 'User created successfully');

     } catch (error) {
      __.errorMsg(res, 500, 'Internal server error', error)
     }
    }

    async userLogin(req, res) {
     try {
          let userData = await UserModel.findOne({ email: req.body.email.toLowerCase() }).select('-isDeleted -__v -updatedAt -createdAt');
          if (!userData) return __.customMsg(res, 404, `${req.body.email} does not exists`);
          
          let verify = await userData.verifyPassword(req.body.password);
          if (!verify)  return __.customMsg(res, 401, "Incorrect Password");
          
          if (!userData.isEmailVerified) return __.customMsg(res, 403, `Please verify your email. Verification email has been sent at this EmailId: ${userData.email}`)         
          userData = userData.toObject();
          
          let token = await jwt.createToken(userData._id); 
          userData.token = token;    
          
          delete userData['password'];
          delete userData['_id'];
          
          return __.successMsg(res, userData, 'User logged successfully');

      } catch (error) {
      __.errorMsg(res, 500, 'internal server error', error);
     }
    }

    async verifyEmail(req, res) {
     try {
       if(!req.query.id) return __.customMsg(res, 400, 'Bad request. Missing data');
       
       let userData = await UserModel.findOne({ _id: req.query.id });
       if (!userData) return __.customMsg(res, 404, `User does not exists`);

       let updateUser = await UserModel.findOneAndUpdate({_id: req.query.id }, {$set: {isEmailVerified: true }}, {new : true }).lean();
       if(!updateUser) return __.customMsg(res, 503, 'Service Unavailable');

       return __.successMsg(res, undefined, 'Your Email is verified.')

     } catch (error) {
      __.errorMsg(res, 500, "Internal server error", error);
     }
    }
}

module.exports = new userAuthentication();