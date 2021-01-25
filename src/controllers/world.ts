import { NextFunction, Request, Response } from "express";
import { words } from "lodash";
import { World, WorldDocument } from "../models/World";

export let getWorldList = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let worldnamelist = new Array();
    World.find({ user_id: user_id }, (err, world) => {
        if (err) {
            return next(err);
        }
        if(world){
            let count = 0;
            world.forEach(item => {
                count++;
                if(worldnamelist.indexOf(item.world_name) < 0){
                    worldnamelist.push(item.world_name);
                }
                if(count == world.length){
                    res.json({ data: worldnamelist});
                }
            })
        } else {
            res.json({data: []});
        }
        // res.json({
        //     data: world
        // })
    });
}
export let getWorldDetailByName = (req: Request, res: Response, next: NextFunction) => {
    let user_id = req.body.user_id;
    let world_name = req.body.world_name;
    World.find({ $and: [{ user_id: user_id }, { world_name: world_name }] }, (err, world) => {
        if (err) {
            return next(err);
        }
        res.json({
            data: world
        })
    });
}
export let postWorldInfo = (req: Request, res: Response, next: NextFunction) => {
    const world = new World({
        user_id: req.body.user_id,
        world_name: req.body.world_name,
        title: req.body.title,
        content1: req.body.content1,
        content2: req.body.content2,
        image: req.body.image,
        color: req.body.color
    });

    world.save((err) => {
        if (err) { return next(err); }
        res.status(200);
        res.json({
            result: world
        });
    });
}