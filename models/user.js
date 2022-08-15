const mongoose = require("mongoose");

const UserRoles = {
    'admin': 'admin',
    'user': 'user'
}

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: 5 },
    password: { type: String, required: true, minLength: 5 },
    role: { type: String, default: UserRoles.user },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "blogs"
        }
    ],
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    profileImgUrl: { type: String }
},
    {
        collection: "users"
    });


module.exports = mongoose.model("user", userSchema);