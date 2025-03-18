import express from 'express';
import * as ticketController from './controllers/ticketController';
import * as db from "./db";
import cors from "cors";

db.connect();

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: process.env.FRONT_ORIGIN
}

console.log("Front origin: ", process.env.FRONT_ORIGIN);

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.get("/ticket/all", ticketController.getTickets);
app.post("/ticket/scan", ticketController.scanTicket);

app.listen(PORT, () => {
    console.log("DB Connection string: ", process.env.DB_CONNECTION_STRING);
    return console.log("Express is listening at http://localhost:" + PORT);
})