const express = require("express");
const fs = require("fs");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DEFAULT_PATH = "/Users/dominyk/Desktop/GCW Database";
const userMiddleware = require("./middleware/users");

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Dom12345",
  database: "Coursework",
});
module.exports = { app };

connection.connect(function (error) {
  if (error) console.log(error);
  else console.log("Connected");
});

const server = app.listen(5556, "127.0.0.1", function () {
  //const host = server.address().address;
  const port = server.address().port;
  console.log("Listening on port " + port);
});

app.get("/movies", userMiddleware.isLoggedIn, function (req, res) {
  connection.query(
    "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
  );
  connection.query(
    "select m.MovieID, m.Title, t.Name as 'Type', group_concat(distinct g.Name separator ', ') as 'Genres', \
      group_concat(distinct Concat(d.Name,' ', Ifnull(d.MiddleName,' '), d.Surname) separator ', ') as 'Directors', \
      m.Rating, m.Description, m.ReleaseDate \
    from Movie m, Type t, Director_Movie d_m, Director d, Genre_Movie g_m, Genre g \
    where m.TypeID = t.TypeID and d.DirectorID = d_m.DirectorID \
      and m.MovieID = d_m.MovieID and g.GenreID = g_m.GenreID and m.MovieID = g_m.MovieID \
    group by m.MovieID;",
    function (error, rows, fields) {
      if (error) console.log(error);
      else {
        rows.forEach(function (part, index, arr) {
          arr[index].Genres = arr[index].Genres.split(", ");
          arr[index].Directors = arr[index].Directors.split(", ");
        });
        const movies = rows;

        connection.query(
          "select m.MovieID, v.Season as 'Season', max(v.Episode) as 'Episodes' \
          from Movie m, Video v \
          where m.MovieID = v.MovieID \
          group by v.Season;",
          function (error, rows, fields) {
            if (error) console.log(error);
            else {
              movies.forEach(element => (element["Seasons"] = []));

              rows.forEach(element => {
                movies
                  .filter(x => x.MovieID === element.MovieID)
                  .map(x =>
                    element.Season
                      ? (x["Seasons"][element.Season] = element.Episodes)
                      : null
                  );
              });
              res.status(200).json(movies);
            }
          }
        );
      }
    }
  );
});

app.get("/video", userMiddleware.isLoggedIn, function (req, res) {
  const MovieID = req.query.MovieID;

  if (MovieID != "undefined" && MovieID != "") {
    const Season = req.query.Season
      ? " and v.Season = " + req.query.Season
      : "";
    const Episode = req.query.Episode
      ? " and v.Episode = " + req.query.Episode
      : "";

    const sql = `select v.Path from Video v where v.MovieID = ${
      MovieID + Season + Episode
    };`;

    connection.query(sql, function (error, rows, fields) {
      if (error) console.log(error);
      else {
        if (rows[0] != null) {
          const path = DEFAULT_PATH + rows[0].Path;

          if (fs.existsSync(path)) {
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
              const parts = range.replace(/bytes=/, "").split("-");
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

              if (start >= fileSize) {
                res
                  .status(416)
                  .send(
                    "Requested range not satisfiable\n" +
                      start +
                      " >= " +
                      fileSize
                  );
                return;
              }

              const chunksize = end - start + 1;
              const file = fs.createReadStream(path, { start, end });
              const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
              };

              res.writeHead(206, head);
              file.pipe(res);
            } else {
              const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
              };
              res.writeHead(200, head);
              fs.createReadStream(path).pipe(res);
            }
          } else res.status(500).send("Can't find video");
        } else res.status(400).send("Invalid ID");
      }
    });
  } else res.status(500).send("Enter movie ID");
});

app.get("/image", function (req, res) {
  const MovieID = req.query.MovieID;
  const Type = req.query.Type;

  if (new Set(["Poster", "Backdrop"]).has(Type)) {
    connection.query(
      `select ${Type} from Movie where MovieID = ${MovieID}`,
      function (error, rows, fields) {
        if (error) console.log(error);
        else {
          if (rows[0] != null) {
            const picPath = DEFAULT_PATH + rows[0][Type];

            if (fs.existsSync(picPath)) {
              const head = {
                "Content-Type": "image/jpeg",
              };
              res.writeHead(200, head);
              fs.createReadStream(picPath).pipe(res);
            } else res.status(500).send("Can't find image");
          } else res.status(400).send("Invalid ID");
        }
      }
    );
  } else res.status(400).send("Invalid Type");
});

app.get("/favorites", userMiddleware.isLoggedIn, function (req, res) {
  const UserID = req.userData.userId;
  connection.query(
    `select * from Favorite where UserID = ${UserID};`,
    function (error, rows, fields) {
      if (error) console.log(error);
      else {
        res.status(200).json(rows.filter(x => x.isValid == true));
      }
    }
  );
});

app.post("/favorite", userMiddleware.isLoggedIn, function (req, res) {
  const MovieID = req.query.MovieID;
  const UserID = req.userData.userId;
  const isValid = req.query.isValid;

  connection.query(
    `select * from Favorite where UserID = ${UserID} and MovieID = ${MovieID}`,
    function (error, rows, fields) {
      if (error) console.log(error);
      else {
        if (rows[0] == null) {
          connection.query(
            `INSERT INTO Favorite (MovieID, UserID, isValid) VALUES \
              (${MovieID}, ${UserID}, ${isValid})`,
            (err, result) => {
              if (err) {
                return res.status(400).send({
                  msg: err,
                });
              }
              return res.status(201).send({
                msg: "OK",
              });
            }
          );
        } else {
          connection.query(
            `UPDATE Favorite
            SET isValid = ${isValid}
            WHERE MovieID = ${MovieID} and ${UserID}`,
            (err, result) => {
              if (err) {
                return res.status(400).send({
                  msg: err,
                });
              }
              return res.status(201).send({
                msg: "OK",
              });
            }
          );
        }
      }
    }
  );
});

app.get("/types_genres", function (req, res) {
  let info = {};

  connection.query(
    "select Name as 'Type' from Type;",
    function (error, rows, fields) {
      if (error) console.log(error);
      else {
        info.Types = Object.keys(rows).map(key => rows[key].Type);
      }
    }
  );

  connection.query(
    "select Name as 'Genre' from Genre;",
    function (error, rows, fields) {
      if (error) console.log(error);
      else {
        info.Genres = Object.keys(rows).map(key => rows[key].Genre);
      }
      res.status(200).json(info);
    }
  );
});

// Authentication

app.post("/signin", (req, res, next) => {
  connection.query(
    `SELECT * FROM User WHERE Email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Username or password is incorrect!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["Password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(401).send({
              msg: "Username or password is incorrect!",
            });
          }
          if (bResult) {
            const token = jwt.sign(
              {
                email: result[0].Email,
                userId: result[0].UserID,
              },
              "TMPKEY",
              {
                expiresIn: "1d",
              }
            );
            delete result[0].Password;
            return res.status(200).send({
              msg: "Logged in!",
              user: { token, ...result[0] },
            });
          }
          return res.status(401).send({
            msg: "Username or password is incorrect!",
          });
        }
      );
    }
  );
});

app.post("/signup", userMiddleware.validateRegister, function (req, res, next) {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const middlename = req.body.middlename;
  const surname = req.body.surname;
  const password = req.body.password;

  connection.query(
    `SELECT * FROM User WHERE LOWER(Email) = LOWER(${connection.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This username is already in use!",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            connection.query(
              `INSERT INTO User (Email, Firstname,${
                middlename ? "Middlename," : ""
              } Surname, Password) VALUES \
              (${connection.escape(email)}, ${connection.escape(firstname)}, \
              ${middlename ? connection.escape(middlename) + "," : ""} \
              ${connection.escape(surname)}, \
              ${connection.escape(hash)})`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: "Registered!",
                });
              }
            );
          }
        });
      }
    }
  );
});
