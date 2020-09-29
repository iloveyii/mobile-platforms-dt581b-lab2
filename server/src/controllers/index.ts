import {Request, Response, NextFunction} from "express";
import path from "path";

// @desc   Get index page from views
// @route  GET /
export const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getIndex");
    return res.sendFile(path.join(__dirname, "../../../", "react", "dist", "index.html"));
};
