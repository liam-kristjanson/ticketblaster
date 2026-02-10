import app from "./app";
import * as db from "./db"
import { configDotenv } from "dotenv";

configDotenv();
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING + "ticketblaster";

db.connect(DB_CONNECTION_STRING);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("DB Connection string: ", process.env.DB_CONNECTION_STRING);
    return console.log("Express is listening at http://localhost:" + PORT);
})