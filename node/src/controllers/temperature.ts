import { Request, Response, NextFunction } from "express";
import { Database } from "../models/base/Database";
import Condition from "../models/base/Condition";
import Temperature from "../models/Temperature";


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
    const model = new Temperature(database, req.body.unit);
    await model.create();
    return res.status(201).send(model.response);
};

// @desc   Update a Model
// @route  UPDATE /api/v1/temperatures/:id
export const updateTemperature = async (req: Request, res: Response, next: NextFunction) => {
    const condition = new Condition({where: {id: req.params.id}});
    const model = new Temperature(database, req.body.unit);
    await model.validate() && await model.update(condition);
    return res.status(200).send(model.response);
};

// @desc   Delete Model
// @route  DELETE /api/v1/temperatures/:id
export const deleteTemperature = async (req: Request, res: Response, next: NextFunction) => {
    const model = new Temperature(database, req.body.unit);
    const condition = new Condition({where: {id: req.params.id}});
    await model.delete(condition);
    return res.status(200).send(model.response);
};
