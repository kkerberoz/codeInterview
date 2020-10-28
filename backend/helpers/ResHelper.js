const success = (res, payload, status = 200) => {
  res.status(status).json({
    status: "success",
    data: payload,
  });
};

const fail = (res, message, status = 400) => {
  res.status(status).json({
    status: "fail",
    message,
  });
};

const unauth = (res, message, status = 401) => {
  res.status(status).json({
    status: "Unauthorized",
    message,
  });
};

const error = (res, err, status = 500) => {
  res.status(status).json({
    status: "error",
    message: err.message,
  });
};

const validPassword = (password) => {
  const passwordRegex = /^.{6,}$/;
  return passwordRegex.test(password);
};

module.exports = { success, fail, unauth, error, validPassword };
