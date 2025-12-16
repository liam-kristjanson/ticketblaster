import app from "./app";
import * as db from "./db"

db.connect();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("DB Connection string: ", process.env.DB_CONNECTION_STRING);
    return console.log("Express is listening at http://localhost:" + PORT);
})