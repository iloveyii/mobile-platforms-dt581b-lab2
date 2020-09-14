import dotenv from "dotenv";
import app from "./src/app";
import boxen from "boxen";
import chalk from "chalk";


const session = require("express-session");


// ----------------------------------
// Environment setup
// ----------------------------------
dotenv.config({path: ".env"});
const {
    REACT_APP_serverIp: SERVER = "http://localhost",
    REACT_APP_PORT: PORT = 5500,
    SESS_NAME = "sid",
    SESS_SECRET = "top-secret",
    SESS_LIFETIME = 1000 * 60 * 60 * 2, // 2 hrs
} = process.env;

app.use(
    session({
        name: SESS_NAME,
        resave: false,
        saveUninitialized: false,
        secret: SESS_SECRET,
        cookie: {
            maxAge: SESS_LIFETIME,
            sameSite: "none",
            secure: false,
        }
    }));

// ----------------------------------
// Express server
// ----------------------------------
const server = app.listen(PORT, () => {
        const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "prod";
        let message = `\n${chalk.bold(`SERVER is running on ${SERVER}:${PORT} in ${ENV} mode `)}`;
        message += `\n${chalk.green('To change these config(server and port), edit .env file')}`;
        message += `\n\n${chalk.red('Press CTRL-C to stop')}`;

        console.log(boxen(message, {
            padding: 1,
            borderColor: 'green',
            margin: 1
        }));
    }
);

export default server;
