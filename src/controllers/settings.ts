import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";

export let createAccount = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Email is not valid").isEmail();
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  let success_flag = false;

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/createAccount");
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    usertype: req.body.usertype,
  });

  // console.log("user:", user);
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      // req.flash("errors", { msg: "Account with that email address already exists." });
      // return res.redirect("/createAccount");
      req.json({msg: "Account with that email address already exists."});
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        success_flag = true;
        res.status(200);
        res.json({
          result: success_flag, data: user
        });
      });
    });
  });
};
