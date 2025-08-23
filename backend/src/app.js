import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express() // creates a app instance which will hold routes, middlewares and configs

app.use(cors({
    origin: process.env.CORS_ORIGIN, // this allow only specific frontend to access your backend
    credentials: true // enables cookies, auth headers etc to sent in requests 
}))

app.use(express.json({ // enables backend to accpet application/json requests
    limit:"16kb" // prevents large JSON bodies
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public")) // This allows you to serve things like images, HTML, CSS, etc., from a folder named public/.
app.use(cookieParser());


export { app }