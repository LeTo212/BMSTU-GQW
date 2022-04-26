const jwt = require("jsonwebtoken");

const isBoolean = (string) => {
  switch (string.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
    case "false":
    case "no":
    case "0":
      return true;

    default:
      return false;
  }
};

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 4
    if (!req.body.email || req.body.email.length < 4) {
      return res.status(400).send({
        msg: "Please enter a email with min. 4 chars",
      });
    }

    // password min 8 chars
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).send({
        msg: "Please enter a password with min. 8 chars",
      });
    }

    // password (repeat) does not match
    if (
      !req.body.passwordRepeat ||
      req.body.password != req.body.passwordRepeat
    ) {
      return res.status(400).send({
        msg: "Both passwords must match",
      });
    }
    next();
  },

  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "TMPKEY");
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: "Your session is not valid!",
      });
    }
  },

  validateVideo: (req, res, next) => {
    if (
      !isNaN(req.query.MovieID) &&
      (!isNaN(req.query.Season) || req.query.Season == null) &&
      (!isNaN(req.query.Episode) || req.query.Episode == null)
    )
      next();
    else
      res.status(400).send({
        msg: "Invalid data!",
      });
  },

  validateImage: (req, res, next) => {
    if (
      !isNaN(req.query.MovieID) &&
      new Set(["Poster", "Backdrop"]).has(req.query.Type)
    )
      next();
    else
      res.status(400).send({
        msg: "Invalid data!",
      });
  },

  validateFavorite: (req, res, next) => {
    if (!isNaN(req.query.MovieID) && isBoolean(req.query.isValid)) next();
    else
      res.status(400).send({
        msg: "Invalid data!",
      });
  },

  validateAddToHistory: (req, res, next) => {
    if (!isNaN(req.query.MovieID)) next();
    else
      res.status(400).send({
        msg: "Invalid data!",
      });
  },
};
