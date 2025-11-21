import express from 'express';

import * as db from "./db";
import cors from "cors";
import bodyParser = require('body-parser');

import * as ticketController from './controllers/ticketController';
import * as eventController from './controllers/eventController';
import * as authController from "./controllers/authController";
import * as authMiddleware from "./middleware/authMiddleware";
import * as venueController from "./controllers/venueController";

db.connect();

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: process.env.FRONT_ORIGIN
}

console.log("Front origin: ", process.env.FRONT_ORIGIN);

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log("Request recieved at " + req.path);
    next();
})

app.use(bodyParser.json());


/////////////////////////
//UNAUTHENTICATED ROUTES
/////////////////////////
app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.post("/auth/login", authController.login);

//////////////////////////////
//AUTHENTICATED ROUTES
/////////////////////////////
app.use(authMiddleware.verifyAuthToken);

//ROLE SPECIFIC AUTH MIDDLEWARE
app.use("/admin/", authMiddleware.verifyAdminStatus);
app.use("/host/", authMiddleware.verifyHostStatus);

app.get("/customer/tickets", ticketController.getCustomerTickets);
app.post("/customer/purchase-ticket", ticketController.purchaseTicket);
app.get("/customer/my-tickets", ticketController.getMyTickets);

app.get("/admin/tickets", ticketController.getAdminTickets);

app.post("/ticket/scan", ticketController.scanTicket);
app.post("/tickets", ticketController.createEventTickets);
app.delete("/ticket", ticketController.deleteTicket);

app.get("/event/all", eventController.getEvents);
app.delete("/event", eventController.deleteEvent);
app.get("/event/my-events", eventController.getMyEvents);
app.post("/event", eventController.createEvent);

app.get("/my-venues", venueController.getMyVenues);
app.post("/venue", venueController.createVenue);
app.delete("/venue", venueController.deleteVenue);

app.get("/host/tickets", ticketController.getHostTickets);

app.listen(PORT, () => {
    console.log("DB Connection string: ", process.env.DB_CONNECTION_STRING);
    return console.log("Express is listening at http://localhost:" + PORT);
})