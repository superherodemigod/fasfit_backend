import { NextFunction, Request, Response } from "express";
import { Post, PostDocument } from "../models/Post";
import { User, UserDocument, AuthToken } from "../models/User";
import { PostLike, PostLikeDocument } from "../models/PostLike"
import { PostComment, PostCommentDocument } from "../models/PostComment"
import admin from "../firebase-config";

export let sendLikeNotification = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let receiver_id;
    let registrationToken;
    Post.findById(post_id, (err, post) => {
        if (err) { return next(err); }
        receiver_id = post.user_id;
        post.total_likes += 1;
        post.save();
        const like = new PostLike({
            sender_id: user_id,
            receiver_id: receiver_id,
            post_id: post_id
        });

        const payload = {
            notification: {
                title: 'Like Notification',
                body: 'I like this post',
            }
        };

        const options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24, // 1 day
        };

        User.findById(receiver_id, (err, result) => {
            if (err) { return next(err); }
            if (result) {
                registrationToken = result.deviceToken;
                if (registrationToken) {
                    admin.messaging().sendToDevice(registrationToken, payload, options)
                        .then(function (response: any) {
                            console.log("Successfully sent message:", response);
                        })
                        .catch(function (error: any) {
                            console.log("Error sending message:", error);
                        });
                }
            }
        })

        like.save((err) => {
            if (err) { return next(err); }
            res.status(200);
            res.json({
                result: "Sent like notification",
                data: like
            });
        });
    })
}

export let sendCommentNotification = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let content = req.body.content;
    let receiver_id = '';
    Post.findById(post_id, (err, post) => {
        if (err) { return next(err); }
        receiver_id = post.user_id;
        post.total_comments += 1;
        post.save();
        const comment = new PostComment({
            sender_id: user_id,
            receiver_id: receiver_id,
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
    })
}

export let getCommentNotifications = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    PostComment.find({ receiver_id: user_id }, (err, results) => {
        if (err) { return next(err); }
        let notifications = Array();
        results.forEach((item) => {
            Post.findById(item.post_id, (err, post) => {
                if (err) { return next(err); }
                let sender_img;
                User.findById(item.sender_id, (err, user) => {
                    if (err) { return next(err); }
                    sender_img = user.profile.picture;
                    let jsonSTR = JSON.stringify(item);
                    item = JSON.parse(jsonSTR);
                    notifications.push({
                        ...item,
                        user_image: sender_img,
                        post_image: post.image,
                        sender_name: user.username
                    });
                    if (notifications.length === results.length) {
                        res.json({
                            data: notifications
                        });
                    }
                })
            })
        })
    })
}

export let getLikeNotifications = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    PostLike.find({ receiver_id: user_id }, (err, results) => {
        if (err) { return next(err); }
        console.log(results);
        let notifications = Array();
        results.forEach((item) => {
            Post.findById(item.post_id, (err, post) => {
                if (err) { return next(err); }
                let sender_img;
                User.findById(item.sender_id, (err, user) => {
                    if (err) { return next(err); }
                    sender_img = user.profile.picture;
                    let jsonSTR = JSON.stringify(item);
                    item = JSON.parse(jsonSTR);
                    notifications.push({
                        ...item,
                        user_image: sender_img,
                        post_image: post.image,
                        sender_name: user.username
                    });
                    if (notifications.length === results.length) {
                        res.json({
                            data: notifications
                        });
                    }
                })
            })
        })
    })
}