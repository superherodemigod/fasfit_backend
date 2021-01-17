import { NextFunction, Request, Response } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import { Faslance, FaslanceDocument } from "../models/Faslance";
import { Rating, RatingDocument } from "../models/Rating";

export let getFaslanceListByProfession = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let profession = req.body.profession;
    let faslances = Array();
    let scopeType;
    User.findById(user_id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        scopeType = user.scope_type;
        User.find({ scope_type: { $in: scopeType } }, function (err, users) {
            if (err) {
                return next(err);
            }
            // res.send(user);
            // console.log(users);
            let count = 0;
            users.forEach((user) => {
                Faslance.find({ $and: [{ user_id: user._id }, { profession: profession }] }, (err, result) => {
                    if (err) { return next(err); }
                    count++;
                    // console.log(resultStr);
                    if (result) {
                        faslances.push(user);
                    }
                    if (users.length === count + 1) {
                        res.json({ "data": faslances });
                    }
                })
            })
            // res.json({ "data": faslances });
        })
    });
}

export let changeFaslance = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;

    Faslance.findOne({ user_id: user_id }, (err, faslance: FaslanceDocument) => {
        if (err) { return next(err); }
        faslance.username = req.body.username;
        faslance.email = req.body.email;
        faslance.profession = req.body.profession;
        faslance.location = req.body.location;
        faslance.prices = req.body.prices;
        faslance.summary = req.body.summary;
        faslance.links = req.body.links;
        faslance.profile_image = req.body.profile_image;
        faslance.gallarys = req.body.gallarys;
        faslance.save((err) => {
            if (err) { return next(err); }
            res.status(200);
            res.json({
                result: faslance
            });
        });
    });
}

export let createFaslance = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let username = req.body.username;
    let email = req.body.email;
    let profession = req.body.profession;
    let location = req.body.location;
    let prices = req.body.prices;
    let summary = req.body.summary;
    let links = req.body.links;
    let profile_image = req.body.profile_image;
    let gallarys = req.body.gallarys;

    let faslance = new Faslance({
        user_id: user_id,
        username: username,
        email: email,
        profession: profession,
        location: location,
        prices: prices,
        summary: summary,
        links: links,
        profile_image: profile_image,
        gallarys: gallarys
    });

    Faslance.findOne({ user_id: user_id }, (err, result) => {
        if (err) { return next(err); }
        if (!result) {
            faslance.save((err) => {
                if (err) { return next(err); }
                res.json(faslance);
            });
        } else {
            res.send("Already Exist!");
        }
    })
}
