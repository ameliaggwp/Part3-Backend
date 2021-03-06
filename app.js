// app.js modile is designated for establishing a connection to the database

const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const notesRouter = require("./controllers/notes")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")

logger.info("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })

app.use(cors())
//Without this json parser, req.body's body property would be undefined (in our post request)
//This turns the json data into a JS object attached to body property
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/users", usersRouter)
app.use("/api/notes", notesRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
