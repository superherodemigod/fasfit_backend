import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";
import * as profileController from "./controllers/profile";
import * as worldController from "./controllers/world";
import * as notificationController from "./controllers/notification";
import * as faslanceController from "./controllers/faslance";
import * as settingsController from "./controllers/settings";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl).then(
  () => {
    console.log("connected DB");
  },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    // req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    // req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.post("/setScope", userController.setScope);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get("/getUserList", homeController.getUserList);
app.post("/addPost", homeController.addPost);
app.get("/getPostListByUser", homeController.getPostListByUser);
app.get("/getUserProfile", profileController.getUserProfile);
app.post("/changeUserProfile", profileController.changeUserProfile);
app.post("/followInvitation", profileController.followInvitation);
app.post("/acceptInvitation", profileController.acceptInvitation);
app.get("/getWorldList", worldController.getWorldList);
app.get("/getWorldDetailByName", worldController.getWorldDetailByName);
app.post("/postWorldInfo", worldController.postWorldInfo);
app.post("/sendCommentNotification", notificationController.sendCommentNotification);
app.post("/sendLikeNotification", notificationController.sendLikeNotification);
app.get("/getCommentNotifications", notificationController.getCommentNotifications);
app.get("/getLikeNotifications", notificationController.getCommentNotifications);
app.post("/createFaslance", faslanceController.createFaslance);
app.get("/getFaslanceListByProfession", faslanceController.getFaslanceListByProfession);
app.post("/createTips", faslanceController.createTips);
app.get("/getFaslance", faslanceController.getFaslance);
app.get("/getTipsList", faslanceController.getTipsList);
app.post("/setRatingAndReview", faslanceController.setRatingAndReview);
app.post("/createAccount", settingsController.createAccount);
app.get("/getAccounts", settingsController.getAccounts);
app.get("/switchAccount", settingsController.switchAccount);
/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});

export default app;
