import express from 'express';

import cors from "cors";
import bodyParser = require('body-parser');

import * as ticketController from './controllers/ticketController';
import * as eventController from './controllers/eventController';
import * as authController from "./controllers/authController";
import * as authMiddleware from "./middleware/authMiddleware";
import * as venueController from "./controllers/venueController";

const app = express();

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
app.post("/admin/tickets", ticketController.createEventTickets);
app.delete("/admin/venue", venueController.adminDeleteVenue);

app.delete("/ticket", ticketController.deleteTicket);

app.get("/event/all", eventController.getEvents);
app.delete("/event", eventController.deleteEvent);
app.get("/event/my-events", eventController.getMyEvents);
app.post("/event", eventController.createEvent);

app.post("/host/ticket/scan", ticketController.scanTicket);
app.get("/host/tickets", ticketController.getHostTickets);
app.post("/host/tickets", ticketController.createEventTickets);
app.post("/host/venue", venueController.createVenue);
app.get("/host/my-venues", venueController.getMyVenues);
app.delete("/host/venue", venueController.hostDeleteVenue);

export default app;