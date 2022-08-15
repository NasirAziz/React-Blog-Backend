const mongoose = require("mongoose");
const assert = require("assert");
const status = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const Categories = require("../models/categories");

const JWT_SECRET = "Xp2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-Ka";


const blogRoutes = {
    // ================= Create Blog =================
    create: async (req, res) => {
        const { title, shortDescription, Description, headerImage } = req.body;
        const { token } = req.headers;
        if (!token) {
            return res.status(status.NOT_FOUND).send("Please login first");
        }
        const user = jwt.verify(token, JWT_SECRET);
        if (!user) {
            return res.status(status.BAD_REQUEST).send("Don't havee permission");
        }
        if (!title || typeof (title) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Title is badly formatted"
            })
        }
        if (!shortDescription || typeof (shortDescription) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Meta Description is badly formatted"
            })
        }
        if (!headerImage || typeof (headerImage) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Header Image is badly formatted"
            })
        }
        if (!Description || typeof (Description) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Description is badly formatted"
            })
        }
        else {
            try {
                const newBlog = await Blog.create({
                    title,
                    shortDescription,
                    Description,
                    headerImage,
                    author: user.id
                });
                const updateUser = await User.findOneAndUpdate({ _id: user.id }, {
                    $push: {
                        blogs: {
                            _id: newBlog._id
                        }
                    }
                })
                return res.status(status.OK).send(newBlog);
            }
            catch (err) {
                return res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
            }
        }
    },
    // ================= Update Blog =================

    update: async (req, res) => {
        const { id } = req.params;
        const { title, shortDescription, Description, headerImage } = req.body;
        const { token } = req.headers;
        let user = null;
        try {
            user = jwt.verify(token, JWT_SECRET);
        }
        catch (e) {
            return res.status(status.NOT_FOUND).send(e.message);
        }

        if (!title || typeof (title) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Title is badly formatted"
            })
        }
        if (!shortDescription || typeof (shortDescription) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Meta Description is badly formatted"
            })
        }
        if (!Description || typeof (Description) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Description is badly formatted"
            })
        }
        if (!headerImage || typeof (headerImage) !== "string") {
            return res.status(status.BAD_REQUEST).json({
                error: "Header Image is badly formatted"
            })
        }
        if (!user) {
            return res.status(status.BAD_REQUEST).send("Please Login");
        }
        else {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const blogId = mongoose.Types.ObjectId(id);
                try {
                    const getBlog = await Blog.findOne({ _id: blogId });
                    if (!getBlog) {
                        return res.status(status.BAD_REQUEST).send("Blog not found.");
                    }
                    else if (getBlog.author.equals(mongoose.Types.ObjectId(user.id))) {
                        const updatedBlog = await Blog.findOneAndUpdate({ _id: blogId }, {
                            title,
                            shortDescription,
                            Description,
                            headerImage,
                        }, {
                            new: true
                        });
                        return res.status(status.OK).send(updatedBlog);
                    }
                    else {
                        return res.status(status.BAD_REQUEST).send("You don't have permissions.");
                    }
                } catch (err) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
                }
            }
            else {
                return res.status(status.NOT_FOUND).send("Blog ID is badly formatted");
            }
        }
    },
    // ================= Get All Blogs =================

    getAllBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find().populate("author");
            if (blogs) {
                return res.status(status.OK).send(blogs);
            }
            else {
                return res.status(status.NOT_FOUND).json("Not found");
            }
        }
        catch (e) {
            return res.status(status.INTERNAL_SERVER_ERROR).json(e.message);
        }
    },
    // ================= Get A Single Blog By Id =================

    getBlogById: async (req, res) => {
        const { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const blogId = mongoose.Types.ObjectId(id);
            try {
                const blog = await Blog.findOne({ _id: blogId }).populate("author");
                if (blog) {
                    return res.status(status.OK).send(blog);
                }
                else {
                    return res.status(status.NOT_FOUND).send(err);
                }
            }
            catch (e) {
                return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
            }
        }
        else {
            return res.status(status.BAD_REQUEST).send("Blog ID is badly formatted");
        }

    },
    // ================= Delete Blog =================

    deleteBlogById: async (req, res) => {
        const { id } = req.params;
        const { token } = req.headers;
        let user = null;
        try {
            user = jwt.verify(token, JWT_SECRET);
        }
        catch (e) {
            return res.status(status.NOT_FOUND).send(e.message);
        }

        if (mongoose.Types.ObjectId.isValid(id)) {
            const blogId = mongoose.Types.ObjectId(id);
            if (!user) {
                return res.status(status.BAD_REQUEST).send("Please Login");
            }
            else {
                try {
                    const getBlog = await Blog.findOne({ _id: blogId });
                    if (!getBlog) {
                        return res.status(status.BAD_REQUEST).send("Blog not found.");
                    }

                    else if (getBlog.author.equals(mongoose.Types.ObjectId(user.id))) {
                        await Blog.findByIdAndDelete(blogId).then((data) => {
                            if (data) {
                                return res.status(status.OK).send(data);
                            }
                            else {
                                return res.status(status.NOT_FOUND).send("Blog not exist.");
                            }
                        }).catch((e) => {
                            return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
                        });
                    }
                    else {

                        return res.status(status.BAD_REQUEST).send("You don't have permissions.");

                    }

                }
                catch (e) {
                    return res.status(status.INTERNAL_SERVER_ERROR).send(e.message);
                }
            }

        }
        else {
            return res.status(status.NOT_FOUND).send("Blog ID is badly formatted");
        }
    },


}

module.exports = blogRoutes;