import express from 'express';

import * as db from "./db";
import cors from "cors";
import bodyParser = require('body-parser');

import * as ticketController from './controllers/ticketController';
import * as eventController from './controllers/eventController';
import * as authController from "./controllers/authController";

db.connect();

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: process.env.FRONT_ORIGIN
}

console.log("Front origin: ", process.env.FRONT_ORIGIN);

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.post("/auth/login", authController.login);

app.get("/ticket/all", ticketController.getTickets);
app.post("/ticket/scan", ticketController.scanTicket);
app.post("/ticket", ticketController.createTicket);

app.get("/event/all", eventController.getEvents);
app.post("/event", eventController.createEvent);

app.listen(PORT, () => {
    console.log("DB Connection string: ", process.env.DB_CONNECTION_STRING);
    return console.log("Express is listening at http://localhost:" + PORT);
})