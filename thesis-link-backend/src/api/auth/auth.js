const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../db/models/user");
const wrap = require("express-async-wrap");

router.post(
    "/",
    wrap(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
            process.env.SECRET
        );
        res.json({ token });
    })
);

router.post(
    "/register",
    wrap(async (req, res) => {
        const {
            first_name,
            last_name,
            email,
            password,
            role,
            authentication_code,
        } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (role === "tutor" && authentication_code !== process.env.AUTH_CODE) {
            return res
                .status(400)
                .json({ message: "Invalid authentication code" });
        }

        const encrypted_pass = bcrypt.hashSync(password, 10);

        user = await User.create({
            first_name,
            last_name,
            email,
            password: encrypted_pass,
            role,
        });

        const token = jwt.sign(
            {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
            process.env.SECRET
        );
        res.json({ token, message: "User registered" });
    })
);

module.exports = router;
