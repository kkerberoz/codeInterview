const User = require("../models/User");
const ResHelper = require("../helpers/ResHelper");

module.exports = {
  register: (req, res) => {
    const { names, username, password } = req.body;
    if (!names) {
      return ResHelper.fail(res, "Names is required");
    }
    if (!username) {
      return ResHelper.fail(res, "Username is required");
    }
    if (!password || !ResHelper.validPassword(password)) {
      return ResHelper.fail(res, "Passowrd must be at least 6 characters");
    }

    User.findOne({ username: username }, (err, user) => {
      if (user) {
        return ResHelper.fail(
          res,
          "An account with this username is already exists"
        );
      } else {
        const newUser = User({ names, username, password });
        newUser.save((err) => {
          if (err) {
            // console.log(err);
            return ResHelper.error(res, err);
          } else {
            ResHelper.success(res, {
              message: "Registration successful!",
            });
          }
        });
      }
    });
  },
  login: (req, res) => {
    let token = req.cookies.jwt;
    const { username, password } = req.body;

    if (!username) {
      return ResHelper.unauth(res, "Username is required");
    }
    if (!password || !ResHelper.validPassword(password)) {
      return ResHelper.unauth(res, "Password must be at least 6 characters");
    }

    User.findByToken(token, (err, user) => {
      if (err) {
        ResHelper.error(res, err);
      }
      if (user) {
        return ResHelper.fail(res, "You are already logged in");
      } else {
        User.findOne({ username: username }, (err, user) => {
          if (!user) {
            return ResHelper.unauth(
              res,
              "You have entered an invalid username or password"
            );
          } else {
            user.comparepassword(password, (err, isMatch) => {
              if (!isMatch) {
                return ResHelper.unauth(
                  res,
                  "You have entered an invalid username or password"
                );
              }
              user.generateToken((err, user) => {
                if (err) {
                  return ResHelper.error(res, err);
                } else {
                  res.cookie("jwt", user.token);
                  ResHelper.success(res, {
                    message: "You've been logged in",
                    token: user.token,
                  });
                }
              });
            });
          }
        });
      }
    });
  },
  logout: (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
      if (err) {
        return ResHelper.error(res, err);
      } else {
        ResHelper.success(res, {
          message: "You've been logged out!",
        });
      }
    });
  },
};
