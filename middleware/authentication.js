const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');

class Jwt {
  
  async createToken (userId){
   return jwt.sign({ userId: userId }, process.env.SecretKey, { expiresIn: 60 * 60 });
  }

  async authentication(req, res, next){
   try {
    let decoded = await jwt.verify(req.headers.authorization, process.env.SecretKey);
     if(decoded){
     let verifyUser = await UserModel.findOne({_id: decoded.userId}).countDocuments ();
     if (!verifyUser) return res.status(401).json({message: "Illegal access"});
     req.userId = decoded.userId;
     next();
   } 
   } catch (error) {
     return res.send(error)
   }      
  }

}

module.exports = new Jwt();