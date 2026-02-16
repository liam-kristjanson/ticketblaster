const express = require('express');
const multer = require('multer');
const fs = require('fs')

const upload = multer({ dest: 'storage/' })


const app = express();

app.use((req, res, next) => {
    console.log("Request recieved at " + req.path);
    next();
})

app.get("/", (req, res) => {
    res.send('Service is running...');
});

app.post("/upload", upload.single("file"), (req, res) => {
    res.json({fileName: req.file.filename});
})

app.get("/file/:id", (req, res) => {
    if (fs.existsSync(__dirname + "/storage/" + req.params.id)) {
        res.sendFile(__dirname + "/storage/" + req.params.id)
    } else {
        res.status(404).json({error: "File not found"});
    }
})

app.listen(3000, () => {
    console.log("Server is running...");
})