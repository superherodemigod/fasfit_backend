import { NextFunction, Request, Response } from "express";
import { Post, PostDocument } from "../models/Post";
import { User, UserDocument, AuthToken } from "../models/User";
import { PostLike, PostLikeDocument } from "../models/PostLike"
import { PostComment, PostCommentDocument } from "../models/PostComment"

export let sendLikeNotification = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let receiver_id;
    
    Post.findById(post_id, (err, post) => {
        if (err) { return next(err); }
        receiver_id =  post.user_id;
        post.total_likes += 1;
        post.save();
    })

    const like = new PostLike({
        sender_id: user_id,
        receiver_id: receiver_id,
        post_id: post_id
    });
    like.save((err) => {
        if (err) { return next(err); }
        res.status(200);
        res.json({
            result: "Sent like notification",
            data: like
        });
    });
}

export let sendCommentNotification = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let content = req.body.content;
    let receiver_id;
    Post.findById(post_id, (err, post) => {
        if (err) { return next(err); }
        receiver_id = post.user_id;
        post.total_comments += 1;
        post.save();
    })

    const comment = new PostComment({
        sender_id: user_id,
        post_id: post_id,
        content: content
    });

    comment.save((err) => {
        if (err) { return next(err); }
        res.status(200);
        res.json({
            result: "Sent comment notification",
            data: comment
        });
    });
}

export let getCommentNotifications = (req: Request, res: Response, next: NextFunction) => {
    // let user_id = req.body.user_id;
    // let notifications = [];
    // PostComment.find({receiver_id: user_id}, (err, notifications) => {
    //     if (err) { return next(err); }
    //     notifications.forEach((notification) =>{
    //         Post.findById(notification.post_id, (err, post) =>{
    //             if (err) { return next(err); }
    //             notification.image = post.image;

    //         })
    //     })
        
    // })
    // res.send(notifications);
}

export let getLikeNotifications = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;

    PostLike.find({receiver_id: user_id}, (err, notifications) => {
        if (err) { return next(err); }
        res.json({
            data: notifications
        });
    })
}