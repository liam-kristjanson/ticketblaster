const express = require('express');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const { randomUUID } = require('crypto');


const app = express();

app.use((req, res, next) => {
    console.log("Request recieved at " + req.path);
    next();
})

app.get("/", (req, res) => {
    res.send('Service is running...');
});

app.post("/upload", (req, res) => {

    if (!req.header("Ticketblaster-Filename")) {
        res.status(400).json({error: "Missing filename header"});
    }

    const fileName = req.header("Ticketblaster-Filename");

    const filePath = __dirname + "/storage/" + fileName;

    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
        res.status(201).json({fileName});
    })

    writeStream.on("error", (err) => {
        console.error(err);
        res.status(500).json({error: "Error writing stream to storage"});
    })
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