const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: { type: String, required: true, minLength: 20 },
    shortDescription: { type: String, required: true, minLength: 20 },
    Description: { type: String, required: true, minLength: 20 },
    headerImage: { type: String, required: true },
    publishDate: { type: Date, default: Date.now(), min: Date.now() },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: "categories"
        }
    ]
},
    {
        collection: "blogs",
    }

);

module.exports = mongoose.model("blog", blogSchema);