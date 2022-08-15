const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Enter valid category name."]
    },
    blogs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "blogs"
        }
    ]
})

module.exports = mongoose.model("categories", categoriesSchema)