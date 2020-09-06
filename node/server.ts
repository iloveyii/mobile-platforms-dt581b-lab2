import dotenv from "dotenv";
import app from "./src/app";

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
    console.log(
        "  SERVER is running on %s:%d in %s mode",
        SERVER,
        PORT,
        process.env.NODE_ENV ? process.env.NODE_ENV : "prod",
    );
    console.log("  To change these config(server and port), edit .env file\n");
    console.log("  Press CTRL-C to stop\n");
});

export default server;
