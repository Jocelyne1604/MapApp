const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 8080; // default port 8080
const auth = require("./auth/index");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const User = require("./routes/users.js");
var $ = require("jquery");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: ["mappapp"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);


//-----Helper Functions
//Makes sure login and registration are valid
function validUser(email, password) {
  const validEmail = typeof email == "string" && email.trim() != "";
  const validPassword =
    typeof password == "string" &&
    password.trim() != "" &&
    password.trim().length >= 6;

  return validEmail && validPassword;
}

function search(maps, query_mapid) {
  let currentPoints = [];
  for (let i = 0; i < maps.length; i++) {
    if (maps[i].id === query_mapid) {
      // console.log(maps[i])
      return maps[i];
    }
  }
}
function searchPlaces(places, query_mapid) {
  let currentPoints = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i].map_id === query_mapid) {
      currentPoints.push(places)
      return currentPoints;
    }
  }
}


//All GET routes here
app.get("/", (req, res) => {
  let templateVars;
  // let currentMap;
  let map;
  let currentMap = { zoom: 7, lat: 36.7783, lng: -119.4179 }
  if (!req.session["user_email"]) {
    // console.log(currentMap)
    let currentPlaces = null;
    User.getMaps(function (maps) {
      let templateVars = {
        user: null, maps: maps, places: null,
        currentMap: JSON.stringify(currentMap), currentPlaces: (currentPlaces)
      };
      res.render("index.ejs", templateVars);
    })
  } else {
    User.getOneByEmail(req.session["user_email"]).then(user => {
      User.getMaps(function (maps) {
        currentMap = search(maps, Number(req.query.mapid));
        map = maps
      })
      User.getPlaces(function (places) {
        let currentPlaces = searchPlaces(places, Number(req.query.mapid));
        if (currentPlaces) {
          templateVars = {
            user: user, maps: map, currentMap: JSON.stringify(currentMap),
            currentPlaces: (currentPlaces[0])
          }
          res.render("index.ejs", templateVars);
        } else {
          let currentMap = { zoom: 7, lat: 36.7783, lng: -119.4179 }
          templateVars = {
            user: user, maps: map, currentMap: JSON.stringify(currentMap), currentPlaces: (currentPlaces)
          }

          res.render("index.ejs", templateVars);
        }
      });
    });
  }
})

//peramiter mapId is the users id whom is currently logged in
//and clicks on the listed map name. should pull overlay of all places corresponding to that map.
app.get("/users/places", (req, res) => {
  User.getPlaces(mapId, function (data) {
    let templateVars = { user: user, places: places };
    res.render("index.ejs", templateVars);
  })
  res.redirect('/');
}),

  app.get("/users/maps", (req, res) => {
    User.getUsersMaps(userId, function (data) {
    })
    res.redirect('/');
  }),

  //register page users who are not already registered can register.
  //changes routes names from /register
  app.get("/users/new", (req, res) => {
    let templateVars = { users: users[req.session["userId"]], showLogin: false };
    res.render("index.ejs", templateVars);
  });

app.post("/maps/new", (req, res) => {
  if (!req.body.zoom || !req.body.lat || !req.body.lng || !req.body.name) {
    res.status(400).send("missing DATA!!!");
    return;
  } else if (!req.session["user_id"]) {
    //uncomment when you have html sorted and button done
    // res.status(400).send("THOU shalt not pass invalid login");
    // return;
  }
  User.createMaps(
    1,
    req.body.name,
    req.body.zoom,
    req.body.lat,
    req.body.lng
  ).then(() => {
    res.status(201).send("you are victoriouso\n");
  });
  //uncomment when you have html sorted and button done
  // User.createMaps(req.session['user_id'], req.body.name, req.body.zoom, req.body.lat, req.body.lng);
});

app.post("/places/new", (req, res) => {
  if (!req.body.desc || !req.body.mapId || !req.body.lng || !req.body.lat) {
    res.status(400).send("missing DATA!!!");
    return;
  } else if (!req.session["user_id"]) {
    //uncomment when you have html sorted and button done
    // res.status(400).send("THOU shalt not pass invalid login");
    // return;
  }
  User.createPlaces(
    1,
    req.body.desc,
    req.body.mapId,
    req.body.lat,
    req.body.lng
  ).then(() => {
    res.status(201).send("you are victoriouso2\n");
  });
  //uncomment when you have html sorted and button done
  // User.createMaps(req.session['user_id'], req.body.name, req.body.zoom, req.body.lat, req.body.lng);
});

app.post("/users", (req, res) => {
  let { email, password } = req.body;
  if (validUser(email, password)) {
    User.getOneByEmail(email).then(user => {
      if (!user) {
        const user = {
          email: email,
          password: bcrypt.hashSync(password, 8),
          created_at: new Date()
        };
        // Store hash in your password DB.
        User.create(user).then(id => {
          req.session["user_id"] = user.id;
          req.session["user_email"] = user.email;
          res.redirect("/");
        });
      } else {
        res.status(400).send("You are already a registered user");
      }
    });
  }
});

// //Login page retrieve users who have already registered using the helper function up top.
//Error messages if not already registered.
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  if (validUser(email, password)) {
    User.getOneByEmail(email).then(user => {
      if (user) {
        result = bcrypt.compareSync(password, user.password);
        if (result) {
          req.session["user_id"] = user.id;
          req.session["user_email"] = user.email;
          res.redirect("/");
          return result;
        }
      }
    });
  } else {
    res.status(400).send("THOU shalt not pass invalid login");
  }
});

// //Logout button application, redirects to login and deletes session encrypted cookie.
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});






//Helper functions here
//generates a hashed password using bcrypt
// function genHashPassword(value) {
//   return (hashedPassword = bcrypt.hashSync(value, 10));
// }

// //Generates a random string of 6 letters and numbers
// function generateRandomString() {
//   let text = "";
//   let possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < 7; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }

// //Retrieves user info to cross refernce against input login registration user data.
// function retrieveUser(email, password) {
//   for (username in users) {
//     let userEmail = users[username]["email"];
//     let userPassword = bcrypt.compareSync(
//       password,
//       users[username]["password"]
//     );
//     if (email === userEmail && userPassword) {
//       return users[username];
//     }
//   }
//   return false;
// }

// //Function that makes sure the user is logged in to view urls on main urls page.
// function userUrls(userId) {
//   let urls = {};
//   for (shorturl in urlDatabase) {
//     if (userId === urlDatabase[shorturl].userID) {
//       urls[shorturl] = urlDatabase[shorturl];
//     }
//   }
//   return urls;
// }

//Main urls page where only logged in user can create edit or delete urls.
// app.get("/urls", (req, res) => {
//   let templateVars = {
//     users: users[req.session["userId"]],
//     urls: userUrls(req.session["userId"])
//   };
//   res.render("urls_index", templateVars);
// });

//Page where logged in registered user can create or add new urls to there profile.
// app.get("/urls/new", (req, res) => {
//   let templateVars = { users: users[req.session["userId"]] };
//   res.render("urls_new", templateVars);
// });

//short urls verification page.
// app.get("/urls/:shortURL", (req, res) => {
//   let templateVars = {
//     shortURL: req.params.shortURL,
//     longURL: urlDatabase[req.params.shortURL],
//     users: users[req.session["userId"]]
//   };
//   if (!req.session["userId"]) {
//     res.status(400).send('get the heck outta here!')
//   } else {
//     res.render("urls_show", templateVars);
//   }
// });

// app.get("/u/:shortURL", (req, res) => {
//   const longURL = urlDatabase[req.params.shortURL].longURL;
//   res.redirect(longURL);
// });

//All POST routes here
// app.post("/urls", (req, res) => {
//   const i = generateRandomString();
//   urlDatabase[i] = {
//     longURL: req.body.longURL,
//     userID: req.session["userId"]
//   };
//   res.redirect("/urls");
// });

//Delete urls that only belong to specific longed in user. cookies verify users.
// app.post("/urls/:shortURL/delete", (req, res) => {
//   const userId = urlDatabase[req.params.shortURL].userID;
//   if (userId === req.session["userId"]) {
//     delete urlDatabase[req.params.shortURL];
//     res.redirect("/urls");
//   } else {
//     res.status(400).send("Can't Delete URL");
//   }
// });

//working short url link to long url.
// app.post("/urls/:shortURL/", (req, res) => {
//   if (urlDatabase[req.params.shortURL].userID !== req.session["userId"]) {
//     console.log(urlDatabase[req.params.shortURL].userID)
//     console.log(req.session["userId"])
//     return res.send('get the heck outta here!')
//   } else {
//     urlDatabase[req.params.shortURL].longURL = req.body.longURL;
//     res.redirect("/urls/");
//   }
// });

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done(users => {
//     for (user of users) {
//       $("<div>")
//         .text(user.name)
//         .appendTo($("body"));
//     }
//   });
// });
