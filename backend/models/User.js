const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    names: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//to register
const salt = 12;

UserSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      }
    });
  } else {
    next();
  }
});

//to login
UserSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(next);
    } else {
      cb(null, isMatch);
    }
  });
};

// generate token
UserSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), JWT_SECRET);

  user.token = token;
  user.save(function (err, user) {
    if (err) {
      return cb(err);
    } else {
      cb(null, user);
    }
  });
};

// find by token
UserSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, JWT_SECRET, function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) {
        return cb(err);
      } else {
        cb(null, user);
      }
    });
  });
};

//delete token
UserSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.updateOne({ $unset: { token: 1 } }, function (err, user) {
    if (err) {
      return cb(err);
    } else {
      cb(null, user);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
