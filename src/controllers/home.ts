import { NextFunction, Request, Response } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import { Post, PostDocument } from "../models/Post";
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
  // console.log("user:", req.user.id);
  let scopeType;
  User.findById(req.body.user_id, (err, user: UserDocument) => {
    if (err) { return next(err); }
    scopeType = user.scope_type;
    User.find({ scope_type: { $in: scopeType } }, function (err, user) {
      if (err) {
        return next(err);
      }
      res.send(user);
    })
  });
}

export let getPostListByUser = (req: Request, res: Response, next: NextFunction) => {
  // let scopeType = req.user.scope_type;
  let scopeType;
  User.findById(req.body.user_id, (err, user: UserDocument) => {
    if (err) { return next(err); }
    scopeType = user.scope_type;
    User.find({ scope_type: { $in: scopeType } }, function (err, user) {
      if (err) {
        return next(err);
      }
      let user_ids = new Array();
      user.forEach((index) => {
        user_ids.push(index._id);
      })
      // console.log(user_ids);
      Post.find({ user_id: { $in: user_ids } }, (err, posts) => {
        if (err) { return next(err); }
        res.send(posts);
      })
    })
  });

}

export let postOneData = (req: Request, res: Response, next: NextFunction) => {
  const post = new Post({
    user_id: req.body.user_id,
    title: req.body.email,
    description: req.body.description,
    image: req.body.image,
    total_likes: 0,
    total_comments: 0
  });

  post.save((err) => {
    if (err) { return next(err); }
    res.status(200);
    res.json({
      result: post
    });
  });
}