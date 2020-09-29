import {Request, Response, NextFunction} from "express";
import {Database} from "../models/base/Database";
import Condition from "../models/base/Condition";
import Temperature from "../models/Temperature";
import {TemperatureT} from "../models/Temperature";

const database = new Database("temperature_units");

// @desc   Get all from Model
// @route  GET /api/v1/temperatures
export const getTemperatures = async (req: Request, res: Response, next: NextFunction) => {
    const model = new Temperature(database, undefined);
    await model.read();
    return res.status(200).send(model.response);
};

// @desc   Get a Model
// @route  GET /api/v1/temperatures/:id
export const getTemperature = async (req: Request, res: Response, next: NextFunction) => {
    const condition = new Condition({where: {id: req.params.id}});
    const model = new Temperature(database, req.body.unit);
    await model.read(condition);
    return res.status(200).send(model.response);
};

// @desc   Create a Model
// @route  POST /api/v1/temperatures
export const createTemperature = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Unit received :", req.body);
    let model: any = {};
    if (Array.isArray(req.body)) {
        req.body.map(async (unit: TemperatureT) => {
            console.log("Created ", unit);
            model = new Temperature(database, unit);
            await model.create();
        })
    } else {
        model = new Temperature(database, req.body.form);
        await model.validate() && await model.create();
    }

    return res.status(201).send(model.response);
};

// @desc   Update a Model
// @route  UPDATE /api/v1/temperatures/:id
export const updateTemperature = async (req: Request, res: Response, next: NextFunction) => {
    let where: any = {};
    if (req.params.id && req.params.id !== "undefined") {
        console.log('Updated by id', req.params.id);
        where = {id: req.params.id}
    } else if (req.body.form.unit_id) {
        console.log('Updated by unit_id', req.body.form.unit_id);
        where = {unit_id: req.params.unit_id}
    } else {
        console.log('Update fail');
        return res.status(404).send({success: false, data: ["No record with id " + req.params.id]});
    }
    const condition = new Condition({where});
    const model = new Temperature(database, req.body.form);
    await model.validate() && await model.update(condition);
    return res.status(200).send(model.response);
};

// @desc   Delete Model
// @route  DELETE /api/v1/temperatures/:id
export const deleteTemperature = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id || req.params.id === 'undefined') {
        console.log('Delete fail');
        return res.status(404).send({success: false, data: ['No record with id ' + req.params.id]});
    } else {
        console.log('Delete pass', req.params.id === 'undefined');
        const model = new Temperature(database, req.body.form);
        const condition = new Condition({where: {id: req.params.id}});
        await model.delete(condition);
        return res.status(200).send(model.response);
    }
};
