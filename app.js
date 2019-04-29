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
app.use(express.static("/styles" + "/public"));
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
  let currentMap;
  let map;
  User.getMaps(function(data) {});
  if (!req.session["user_email"]) {
    let currentMap = { zoom: 10, lat: 43.6532, lng: -79.3832 }
    let templateVars = {
      user: null, maps: null, places: null,
      currentMap: JSON.stringify(currentMap)
    };
    res.render("index.ejs", templateVars);
  } else {
    User.getOneByEmail(req.session["user_email"]).then(user => {
      User.getMaps(function (maps) {
        currentMap = search(maps, Number(req.query.mapid));
        map = maps
      })
      User.getPlaces(function (places) {
        let currentPlaces = searchPlaces(places, Number(req.query.mapid));
        // console.log(currentPlaces)
        templateVars = {
          user: user, maps: map, currentMap: JSON.stringify(currentMap),
          currentPlaces: (currentPlaces[0])
        };
        // console.log(templateVars.currentPlaces)
      User.getMaps(function(maps) {
        let templateVars = { user: user, maps: maps };
        res.render("index.ejs", templateVars);
      });
    });

//peramiter mapId is the users id whom is currently logged in
//and clicks on the listed map name. should pull overlay of all places corresponding to that map.
app.get("/users/places", (req, res) => {
  User.getPlaces(mapId, function (data) {
    let templateVars = { user: user, places: places };
    res.render("index.ejs", templateVars);
  })
  res.redirect('/');
  User.getPlaces(mapId, function(data) {});
  res.redirect("/");
}),
  app.get("/users/maps", (req, res) => {
    User.getUsersMaps(userId, function(data) {});
    res.redirect("/");
  }),
  //register page users who are not already registered can register.
  //changes routes names from /register
  app.get("/users/new", (req, res) => {
    let templateVars = {
      users: users[req.session["userId"]],
      showLogin: false
    };
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
  console.log("processing Logging in");
  if (validUser(email, password)) {
    User.getOneByEmail(email).then(user => {
      if (user) {
        // result = bcrypt.compareSync(password, user.password);
        // if (result) {
        console.log("Logging in");
        req.session["user_id"] = user.id;
        req.session["user_email"] = "a@b.c";
        res.redirect("/");
        return true;
        // }
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
})