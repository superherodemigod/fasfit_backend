import { NextFunction, Request, Response } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import { Post, PostDocument } from "../models/Post";
import { UserFollower, UserFollowerDocument } from "../models/UserFollower";

export let getUserProfile = (req: Request, res: Response, next: NextFunction) => {
    // console.log("user:", req.user.id);
    let scopeType;
    let user_id = req.body.user_id;
    // UserFollower.f
    User.findById(user_id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        scopeType = user.scope_type;
        User.find({ scope_type: { $in: scopeType } }, function (err, users) {
            if (err) {
                return next(err);
            }
            let user_ids = new Array();
            users.forEach((index) => {
                user_ids.push(index._id);
            })
            // console.log(user_ids);
            Post.find({ user_id: { $in: user_ids } }, (err, posts) => {
                if (err) { return next(err); }
                res.json({
                    user: user.profile, userlist: users, post: posts
                });
            })
        })
    });
}

export let changeUserProfile = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;

    User.findById(user_id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.profile = req.body.profile;
        user.scope_type = req.body.scope_type;
        user.save((err) => {
            if (err) { return next(err); }
            res.status(200);
            res.json({
                result: user
            });
        });
    });
}