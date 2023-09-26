const express = require("express");
const PORT = 1234;
const PATH = require("path");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Strategy = require("./config/passport-local-strategy");
const expressSesssion = require("express-session");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const { setFlash } = require("./config/middleware");
app.use(express.static("./assets"));

app.use(cookieParser());
app.use(expressLayouts);
app.use(cors());

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", PATH.join(__dirname, "views"));
app.use(
    expressSesssion({
        name: "Auth",
        secret: "secret",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        },
        store: mongoStore.create({
            mongoUrl: "mongodb://127.0.0.1/authentication-session"
        })
    })
);
console.log("sad");
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(setFlash);

app.use("/", require("./routes/index"));

//Deprecated
// app.use(express.urlencoded());

app.listen(PORT, function (err) {
    if (err) {
        console.log(`Error while running on port ${PORT} ${err}`);
    }
    console.log(`Server is up and running on PORT ${PORT}`);
});
