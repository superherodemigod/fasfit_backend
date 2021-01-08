import { NextFunction, Request, Response } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};


export let getUserList = (req: Request, res: Response, next: NextFunction) => {
  let scopeCategory = req.user.scope_category;
  let scopeType = req.user.scope_type;
  User.find({ $and: [{ scope_category: { $in: scopeCategory }, scope_type: { $in: scopeType } }] }, function (err, user) {
    if(err){
      return next(err);
    }
    res.send(user);
  })
}

export let getPostListByUser = (req: Request, res: Response) => {
  
}
export let postOneData = (req: Request, res: Response) => {

}