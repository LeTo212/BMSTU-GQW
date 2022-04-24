const express = require("express");
const fs = require("fs");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DEFAULT_PATH = "/Users/dominyk/Desktop/GCW Database/Movies";
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
    "SELECT m.MovieID, m.Title, t.Name AS 'Type', GROUP_CONCAT(DISTINCT g.Name SEPARATOR ', ') AS 'Genres', \
      GROUP_CONCAT(DISTINCT CONCAT(d.Name,' ', IFNULL(CONCAT(d.MiddleName, ' '),''), d.Surname) SEPARATOR ', ') AS 'Directors', \
      GROUP_CONCAT(DISTINCT CONCAT(a.Name,' ', IFNULL(CONCAT(a.MiddleName, ' '),''), a.Surname) SEPARATOR ', ') AS 'Actors', \
      m.Rating, m.Description, m.ReleaseDate \
    FROM Movie m, Type t, Genre g, Director_Movie d_m, Director d, Genre_Movie g_m, Actor a, Actor_Movie a_m \
    WHERE m.TypeID = t.TypeID \
      AND g.GenreID = g_m.GenreID AND m.MovieID = g_m.MovieID \
      AND d.DirectorID = d_m.DirectorID AND m.MovieID = d_m.MovieID \
      AND a.ActorID = a_m.ActorID AND m.MovieID = a_m.MovieID \
    GROUP BY m.MovieID;",
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else {
        rows.forEach(function (part, index, arr) {
          arr[index].Genres = arr[index].Genres.split(", ");
          arr[index].Directors = arr[index].Directors.split(", ");
          arr[index].Actors = arr[index].Actors.split(", ");
        });
        const movies = rows;

        connection.query(
          "SELECT m.MovieID, v.Season AS 'Season', MAX(v.Episode) AS 'Episodes' \
          FROM Movie m, Video v \
          WHERE m.MovieID = v.MovieID \
          GROUP BY v.Season;",
          function (error, rows) {
            if (error) {
              console.log(error);
              res.status(400).send();
            } else {
              movies.forEach((element) => (element["Seasons"] = []));

              rows.forEach((element) => {
                movies
                  .filter((x) => x.MovieID === element.MovieID)
                  .map((x) =>
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
  const Season = req.query.Season;
  const Episode = req.query.Episode;

  if (!isNaN(MovieID)) {
    const SeasonString = Season
      ? " AND v.Season = " + connection.escape(Season)
      : "";
    const EpisodeString = Episode
      ? " AND v.Episode = " + connection.escape(Episode)
      : "";

    const sql = `SELECT v.Path FROM Video v WHERE v.MovieID = ${
      connection.escape(MovieID) + SeasonString + EpisodeString
    };`;

    connection.query(sql, function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else {
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
          } else
            res.status(500).json({
              msg: "Can't find video",
            });
        } else
          res.status(400).json({
            msg: "Invalid ID",
          });
      }
    });
  } else
    res.status(500).json({
      msg: "Enter movie ID",
    });
});

app.get("/image", function (req, res) {
  const MovieID = req.query.MovieID;
  const Type = req.query.Type;

  if (new Set(["Poster", "Backdrop"]).has(Type)) {
    connection.query(
      `SELECT ${Type} FROM Movie WHERE MovieID = ${connection.escape(MovieID)}`,
      function (error, rows) {
        if (error) {
          console.log(error);
          res.status(400).send();
        } else {
          if (rows[0] != null) {
            const picPath = DEFAULT_PATH + rows[0][Type];

            if (fs.existsSync(picPath)) {
              const head = {
                "Content-Type": "image/jpeg",
              };
              res.writeHead(200, head);
              fs.createReadStream(picPath).pipe(res);
            } else
              res.status(500).json({
                msg: "Can't find image",
              });
          } else
            res.status(400).json({
              msg: "Invalid ID",
            });
        }
      }
    );
  } else
    res.status(400).json({
      msg: "Invalid Type",
    });
});

//// Favorites
//
app.get("/favorites", userMiddleware.isLoggedIn, function (req, res) {
  const UserID = req.userData.userId;

  connection.query(
    `SELECT * FROM Favorite WHERE UserID = ${connection.escape(UserID)};`,
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else res.status(200).json(rows.filter((x) => x.isValid == true));
    }
  );
});

app.post("/favorite", userMiddleware.isLoggedIn, function (req, res) {
  const MovieID = req.query.MovieID;
  const UserID = req.userData.userId;
  const isValid = req.query.isValid;

  connection.query(
    `SELECT * FROM Favorite WHERE MovieID = ${connection.escape(MovieID)} \
      AND UserID = ${connection.escape(UserID)}`,
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else {
        if (rows[0] == null) {
          connection.query(
            `INSERT INTO Favorite (MovieID, UserID, isValid, Date) VALUES \
              (${connection.escape(MovieID)}, 
              ${connection.escape(UserID)}, 
              ${isValid},
              ${connection.escape(
                new Date().toISOString().slice(0, 19).replace("T", " ")
              )})`,
            (err) => {
              if (err) {
                console.log(err);
                res.status(400).send();
              } else
                res.status(201).json({
                  msg: "OK",
                });
            }
          );
        } else {
          const updateDate = isValid
            ? ", Date = " +
              connection.escape(
                new Date().toISOString().slice(0, 19).replace("T", " ")
              )
            : null;

          connection.query(
            `UPDATE Favorite \
            SET isValid = ${isValid} ${updateDate} \
            WHERE MovieID = ${connection.escape(MovieID)} \
              AND UserID = ${connection.escape(UserID)}`,
            (err) => {
              if (err) {
                console.log(err);
                res.status(400).send();
              } else
                res.status(201).json({
                  msg: "OK",
                });
            }
          );
        }
      }
    }
  );
});
//
////

//// History
//
app.get("/history", userMiddleware.isLoggedIn, function (req, res) {
  const UserID = req.userData.userId;

  connection.query(
    `SELECT * FROM History WHERE UserID = ${connection.escape(UserID)};`,
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else res.status(200).json(rows);
    }
  );
});

app.post("/addToHistory", userMiddleware.isLoggedIn, function (req, res) {
  const UserID = req.userData.userId;
  const MovieID = req.query.MovieID;

  connection.query(
    `SELECT * FROM History WHERE UserID = ${connection.escape(UserID)}`,
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else if (!rows.find((el) => el.MovieID == MovieID)) {
        connection.query(
          `INSERT INTO History (UserID, MovieID, Date) VALUES \
            (${connection.escape(UserID)}, 
            ${connection.escape(MovieID)}, 
            ${connection.escape(
              new Date().toISOString().slice(0, 19).replace("T", " ")
            )})`,
          (err) => {
            if (err) {
              console.log(err);
              res.status(400).send();
            } else
              res.status(201).json({
                msg: "OK",
              });
          }
        );
      } else {
        connection.query(
          `UPDATE History \
          SET Date = ${connection.escape(
            new Date().toISOString().slice(0, 19).replace("T", " ")
          )} \
          WHERE UserID = ${connection.escape(UserID)} \
            AND MovieID = ${connection.escape(MovieID)}`,
          (err) => {
            if (err) {
              console.log(err);
              res.status(400).send();
            } else
              res.status(201).json({
                msg: "OK",
              });
          }
        );
      }
    }
  );
});
//
////

app.get("/types_genres", function (req, res) {
  let info = {};

  connection.query("SELECT Name AS 'Type' FROM Type;", function (error, rows) {
    if (error) {
      console.log(error);
      res.status(400).send();
    } else info.Types = Object.keys(rows).map((key) => rows[key].Type);
  });

  connection.query(
    "SELECT Name AS 'Genre' FROM Genre;",
    function (error, rows) {
      if (error) {
        console.log(error);
        res.status(400).send();
      } else {
        info.Genres = Object.keys(rows).map((key) => rows[key].Genre);
        res.status(200).json(info);
      }
    }
  );
});

//// Authentication
//
app.post("/signin", (req, res) => {
  connection.query(
    `SELECT * FROM User WHERE Email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send();
      }

      if (!result.length) {
        res.status(401).json({
          msg: "Username or password is incorrect!",
        });
      }

      bcrypt.compare(
        req.body.password,
        result[0]["Password"],
        (bErr, bResult) => {
          if (bErr) {
            res.status(401).json({
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
            res.status(200).json({
              msg: "Logged in!",
              user: { token, ...result[0] },
            });
          } else
            res.status(401).json({
              msg: "Username or password is incorrect!",
            });
        }
      );
    }
  );
});

app.post("/signup", userMiddleware.validateRegister, function (req, res) {
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
        res.status(409).json({
          msg: "This username is already in use!",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            res.status(500).json({
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
              (err) => {
                if (err) {
                  console.log(err);
                  res.status(400).json({
                    msg: err,
                  });
                } else
                  res.status(201).json({
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
//
////
