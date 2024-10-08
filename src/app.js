if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// TODO: Add your code here
app.use(cors());
app.use(express.json());
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);


// 404 when path not found
app.use((req, res, next) => {
    return next({ status: 404, message: `Not found: ${req.originalUrl}` });
});


//general error handling
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).json({ error: message });
});

module.exports = app;
