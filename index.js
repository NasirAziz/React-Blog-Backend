const express = require("express");
const cors = require("cors");
const status = require("http-status-codes").StatusCodes;
const mongoose = require("mongoose");

const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// ================= Database Connection =================

mongoose.connect("mongodb://127.0.0.1:27017/blog-db").then(() => {
    console.log("Connected to Database")
}).catch((err) => {
    console.log(`Error while connecting to database ${err.message}`)
})

// ================= Home Route =================

app.get("/", (req, res) => {
    return res.status(status.OK).send("Home");
})

// ================= User Routes =================

app.post("/user/register", userRoutes.register);
app.post("/user/login", userRoutes.login);

// ================= Blog Routes =================

app.post("/blogs/create", blogRoutes.create);
app.get("/blogs", blogRoutes.getAllBlogs);
app.get("/blog/:id", blogRoutes.getBlogById);
app.delete("/blog/:id", blogRoutes.deleteBlogById);
app.post("/blog/update/:id", blogRoutes.update);

// ================= Server Config =================

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})