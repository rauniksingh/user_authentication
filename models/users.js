const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({

userName: {
    type: String
},

email: {
   type: String,
   lowercase: true
},

isEmailVerified: {
 type: Boolean,
 default: false
},

phoneNumber: {
 type: String
},

password: {
 type: String
},

isDeleted: {
 type: Boolean,
 default: false
}
},{
    timestamps: true
})

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//method to decrypt password
userSchema.methods.verifyPassword = function (password) {
  let user = this;
  return bcrypt.compareSync(password, user.password);
};

let userModel = mongoose.model('user', userSchema, 'user');
module.exports = userModel;