const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  User = require("./models/User"),
  Course = require("./models/Course"),
  Task = require("./models/Task");
//Connecting database
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => app.listen(port, () => console.log("Server Up and running")))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.use(
  require("express-session")({
    secret: "Lets make the project",
    resave: false,
    saveUninitialized: false,
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  let authe = "";
  if (req.isAuthenticated()) authe = "logged";
  else authe = "logout";

  res.render("home", { auth: authe });
});
app.get("/userprofile", isLoggedIn, (req, res) => {
  res.render("userprofile", { userdetails: req.user });
});
//Auth Routes
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/userprofile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      language: req.body.language,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/login");
      });
    }
  );
});
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    User.find({}, (err, user) => {
      res.render("userprofile.ejs", { userdetails: user });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(
      id,
      {
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role,
        language: req.body.language,
      },
      (err) => {
        if (err) return res.send(500, err);
        res.redirect("/userprofile");
      }
    );
  });

app.get("/task", isLoggedIn, (req, res) => {
  Task.find({}, (err, tasks) => {
    res.render("task.ejs", { Tasks: tasks });
  });
});

app.post("/task", isLoggedIn, async (req, res) => {
  let ch;
  if (req.body.comp == "on") ch = "Completed";
  else ch = "Not Completed";
  const todoTask = new Task({
    content: req.body.content,
    iscomplete: ch,
  });

  try {
    await todoTask.save();
    res.redirect("/task");
  } catch (err) {
    console.log(err);
    res.redirect("/task");
  }
});

app
  .route("/task/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    Task.find({}, (err, tasks) => {
      res.render("taskedit.ejs", { Tasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    Task.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/task");
    });
  });

app.route("/task/remove/:id").get((req, res) => {
  const id = req.params.id;
  Task.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/task");
  });
});

app.get("/course", isLoggedIn, (req, res) => {
  Course.find({}, (err, courses) => {
    res.render("course.ejs", { Courses: courses });
  });
});
