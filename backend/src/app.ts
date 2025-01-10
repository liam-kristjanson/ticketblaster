import express from 'express';
const app = express();
const PORT = process.env.PORT || 8080;


app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    return console.log("Express is listening at http://localhost:" + PORT);
})