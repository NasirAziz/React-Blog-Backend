const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require("../models/user");
const JWT_SECRET = "Xp2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-Ka";
const userRoutes = {
    register: async (req, res) => {
        const { username, password: plainPassword, emailAddress, profileImgUrl, fullName } = req.body;

        if (!username || typeof (username) != "string") {
            return res.status(400).send("Invalid username or password");
        }
        if (!plainPassword || typeof (plainPassword) != "string") {
            return res.status(400).send("Invalid username or password");
        }
        if (!emailAddress || typeof (emailAddress) != "string") {
            return res.status(400).send("Invalid Email Address");
        }
        if (!fullName || typeof (fullName) != "string") {
            return res.status(400).send("Enter Full Name");
        }
        if (!profileImgUrl || typeof (profileImgUrl) != "string") {
            return res.status(400).send("Invalid Profile Image URL");
        }
        if (plainPassword.length < 5) {
            return res.status(400).send("Password must be greater than 5 characters");
        }
        if (username.length < 5) {
            return res.status(400).send("Username must be greater than 5 characters");
        }
        else {
            try {
                const user = await User.findOne({ username: username }).lean();

                if (user) {
                    return res.status(400).send("Username already exist");
                }
                else {
                    const password = await bcrypt.hash(plainPassword, 10);

                    const newUser = await User.create({
                        username,
                        password,
                        fullName,
                        emailAddress,
                        profileImgUrl
                    })
                    res.status(200).send(newUser);


                }
            }
            catch (err) {
                if (err.code === 11000) {
                    res.status(400).send("Username already exist");
                }
                res.status(500).send(err.message);
            }
        }
    },
    login: async (req, res) => {
        const { username, password: plainPassword } = req.body;

        if (!username || typeof (username) != "string") {
            return res.status(400).send("Invalid username or password");
        }
        if (!plainPassword || typeof (plainPassword) != "string") {
            return res.status(400).send("Invalid username or password");
        }
        else {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return res.status(400).send("Invalid username or password");
                }
                else {
                    if (await bcrypt.compare(plainPassword, user.password)) {
                        const token = jwt.sign({
                            id: user._id,
                            username: user.username,
                            role: user.role
                        }, JWT_SECRET)
                        return res.status(200).send(token);
                    }
                    else {
                        return res.status(400).send("Invalid username or password");
                    }
                }
            } catch (err) {
                return res.status(500).send(err.message)
            }
        }
    }
}

module.exports = userRoutes;