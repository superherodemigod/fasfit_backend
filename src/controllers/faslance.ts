import { NextFunction, Request, Response } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import { Faslance, FaslanceDocument } from "../models/Faslance";
import { Rating, RatingDocument } from "../models/Rating";
import { ObjectID } from "mongodb";
import { Tips } from "../models/Tips";

export let getFaslanceListByProfession = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.body.user_id;
    const profession = req.body.profession;
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
    const user_id = req.body.user_id;

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
    const user_id = req.body.user_id;
    const username = req.body.username;
    const email = req.body.email;
    const profession = req.body.profession;
    const location = req.body.location;
    const prices = req.body.prices;
    const summary = req.body.summary;
    const links = req.body.links;
    const profile_image = req.body.profile_image;
    const gallarys = req.body.gallarys;

    const faslance = new Faslance({
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

export let setRatingAndReview = (req: Request, res: Response, next: NextFunction) => {
    const rating = new Rating({
        client_id: req.body.client_id,
        faslance_id: req.body.faslance_id,
        rate: req.body.rate,
        review: req.body.review,
        complete: req.body.complete,
    });
    rating.save((err) => {
        if (err) { return next(err); }
        res.json({ "data": rating });
    });
}

export let getFaslance = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.body.user_id;
    Faslance.findOne({ user_id: user_id }, (err, result) => {
        if (err) { return next(err); }
        const faslancer_id = result._id;
        Rating.find({ faslancer_id: faslancer_id }, (err, ratings) => {
            if (err) { return next(err); }
            res.json({ "faslance": result, "ratings": ratings });
        })

    })
}

export let getFaslancePOV = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.body.user_id;
    Faslance.findOne({ user_id: user_id }, (err, faslance) => {
        if (err) { return next(err); }
        let scopeType;
        let faslances = new Array();
        User.findById(user_id, (err, user: UserDocument) => {
            if (err) { return next(err); }
            scopeType = user.scope_type;
            User.find({ scope_type: { $in: scopeType } }, function (err, users) {
                if (err) {
                    return next(err);
                }
                let count = 0;
                users.forEach((user) => {
                    Faslance.find({ user_id: user._id }, (err, result) => {
                        if (err) { return next(err); }
                        count++;
                        if (result) {
                            faslances.push(user);
                        }
                        if (users.length === count + 1) {
                            res.json({ "faslance": faslance, "pov": faslances });
                        }
                    })
                })
            })
        });
    })
}

export let createTips = (req: Request, res: Response, next: NextFunction) => {
    const tips = new Tips({
        user_id: req.body.user_id,
        content: req.body.content
    })
    tips.save(err => {
        if (err) { return next(err); }
        res.json({ "data": tips });
    })
}
export let getTipsList = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.body.user_id;
    let tips = Array();
    let scopeType;
    User.findById(user_id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        scopeType = user.scope_type;
        User.find({ scope_type: { $in: scopeType } }, function (err, users) {
            if (err) {
                return next(err);
            }
            let count = 0;
            users.forEach((user) => {
                Tips.find({ user_id: user._id }, (err, result) => {
                    if (err) { return next(err); }
                    count++;
                    if (result) {
                        let username = user.username;
                        let image = user.profile.picture;
                        let jsonSTR = JSON.stringify(result);
                        result = JSON.parse(jsonSTR);

                        tips.push({
                            ...result,
                            "username": username,
                            "image": image
                        });
                    }
                    if (users.length === count + 1) {
                        console.log("tips");
                        res.json({ "data": tips });
                    }
                })
            })
            // res.json({ "data": faslances });
        })
    });
}
