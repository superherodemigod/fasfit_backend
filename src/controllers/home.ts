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
  console.log("user:", req.user.id);
  let scopeType = req.user.scope_type;
  User.find({ scope_type: { $in: scopeType } }, function (err, user) {
    if (err) {
      return next(err);
    }
    res.send(user);
  })
}

export let getPostListByUser = (req: Request, res: Response, next: NextFunction) => {
  let userId = req.body.user_id;
  Post.find({ user_id: userId }, (err, posts) => {
    if (err) { return next(err); }
    res.send(posts);
  })
}

export let postOneData = (req: Request, res: Response, next: NextFunction) => {
  const post = new Post({
    user_id: req.user.id,
    title: req.body.email,
    description: req.body.description,
    image: req.body.image,
    image_id: req.body.image_id,
    like: req.body.like,
    comment: req.body.comment
  });

  post.save((err) => {
    if (err) { return next(err); }
    res.status(200);
    res.json({
      result: post
    });
  });
}