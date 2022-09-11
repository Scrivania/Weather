const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/meteo.html");
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});