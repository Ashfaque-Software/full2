const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.Model");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, password, gender, age } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Error in hashing password" });
            }
            const user = new userModel({ name, email, password: hash, gender, age });
            await user.save();
            res.status(201).json({ msg: "User registered successfully" });
        });
    } catch (error) {
        res.status(501).json({ msg: `Internal server error: ${error.message}` });
    }
});

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
