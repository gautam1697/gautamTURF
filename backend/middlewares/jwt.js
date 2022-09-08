let jwt = require("jsonwebtoken");
const user=require('../models/user.Model')
const crypto=require('crypto')

exports.sign = function (user) {
  var payload = {
    id: user._id,
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    idmUser: user.idmUser || false,
    role:user.role
  };


  try {
    return jwt.sign(payload, process.env.JWT_SECRET);
  } catch (err) {}
};

exports.verify = function (req, res, secret = null) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token || token === "") {
    return null;
  } else if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);

    try {
      let info = jwt.verify(token,process.env.JWT_SECRET);
      return info;
    } catch (err) {
      return null;
    }
  }
};

exports.decode = function (token) {
  return jwt.decode(token, { complete: true });
};


exports.getResetPasswordToken=function(){
  const resetToken=crypto.randomBytes(20).toString('hex');
  user.ResetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
  user.ResetPasswordExpire=Date.now()+10*60*1000;
  return resetToken;
}