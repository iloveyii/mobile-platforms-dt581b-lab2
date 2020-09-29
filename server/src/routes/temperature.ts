import express from "express";
import { getTemperature, getTemperatures, createTemperature, updateTemperature, deleteTemperature } from "../controllers/temperature";


const router = express.Router();

router.route("/:id")
    .get(getTemperature)
    .delete(deleteTemperature)
    .put(updateTemperature);

router.route("/")
    .get(getTemperatures)
    .post(createTemperature);

export default router;
