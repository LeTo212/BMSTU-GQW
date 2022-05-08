const authConfig = require("../authConfig.json");
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
  validateLogin: (req, res, next) => {
    if (req.body.email && req.body.password) next();
    else
      res.status(400).send({
        msg: "Invalid request",
      });
  },

  validateRegister: (req, res, next) => {
    if (
      req.body.email &&
      req.body.firstname &&
      req.body.surname &&
      req.body.password &&
      req.body.passwordRepeat
    ) {
      // username min length 4 chars and max length 60 chars
      if (req.body.email.length < 4 || req.body.email.length > 60) {
        return res.status(400).send({
          msg: "Please enter a email with min. 4 chars and max. 60 chars",
        });
      }

      // firstname max length 60 chars
      if (req.body.firstname.length > 60) {
        return res.status(400).send({
          msg: "Please enter a firstname with max. 60 chars",
        });
      }

      // middlename max length 60 chars
      if (req.body.middlename && req.body.middlename.length > 60) {
        return res.status(400).send({
          msg: "Please enter a middlename with max. 60 chars",
        });
      }

      // surname max length 60 chars
      if (req.body.surname.length > 60) {
        return res.status(400).send({
          msg: "Please enter a surname with max. 60 chars",
        });
      }

      // password min length 8 chars and max length 200 chars
      if (req.body.password.length < 8 || req.body.password.length > 200) {
        return res.status(400).send({
          msg: "Please enter a password with min. 8 chars and max. 200 chars",
        });
      }

      // password (repeat) does not match
      if (req.body.password != req.body.passwordRepeat) {
        return res.status(400).send({
          msg: "Both passwords must match",
        });
      }

      next();
    } else
      res.status(400).send({
        msg: "Invalid request",
      });
  },

  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, authConfig.secret);
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: "Your session is not valid",
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
        msg: "Invalid request",
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
        msg: "Invalid request",
      });
  },

  validateFavorite: (req, res, next) => {
    if (!isNaN(req.query.MovieID) && isBoolean(req.query.isValid)) next();
    else
      res.status(400).send({
        msg: "Invalid request",
      });
  },

  validateAddToHistory: (req, res, next) => {
    if (!isNaN(req.query.MovieID)) next();
    else
      res.status(400).send({
        msg: "Invalid request",
      });
  },
};
