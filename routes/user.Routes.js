const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.Model");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    const {email, password,cpassword } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
        return res.status(400).json({ message: "user is already exist" })
    }

    try {

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).json({ message: "error hashing password" })
            }
            else {
                let token = jwt.sign({ email: email }, process.env.SECRET_KEY);
                let user = new userModel({
                    email,
                    password: hash,
                    cpassword:hash
                })
                await user.save();
                res.status(200).json({ message: "user registered successfully", token })
            }

        });
    } catch (error) {
        res.status(400).json({ message: "error while registering" })
    }

})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Error in comparing password" });
            }
            if (result) {
                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ msg: "User logged in successfully", token });
            } else {
                res.status(400).json({ msg: "Invalid credentials" });
            }
        });
    } catch (error) {
        res.status(501).json({ msg: `Error in login: ${error.message}` });
    }
});

module.exports = userRouter;
