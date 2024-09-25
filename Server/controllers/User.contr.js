require("dotenv").config();
const colors = require("colors");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");



const createSendToken = (NewUser, StatusCode, res) => {

    const token = jwt.sign({ email: NewUser.email, id: NewUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(StatusCode).json({
        status: "success",
        token,
        data: NewUser
    })

}

const RegisterUser = async (req, res) => {
    try {
        const {
            username,
            email,
            passwordHash,
            profilePicture,
            phoneNumber,
            address,
            bio
        } = req.body;
        console.log(req.body);

        if (!username || !email || !passwordHash || !profilePicture || !phoneNumber || !bio) {
            return res.status(400).json({
                error: "All Fields Are Required"
            })
        }

        const EmailExist = await User.findOne({ email });

        if (EmailExist) return res.json({ message: "Email Already Exists" })

        const NewUser = await User.create({
            username,
            email,
            passwordHash,
            profilePicture,
            phoneNumber,
            address,
            bio
        });

        res.status(200).json({ NewUser, message: "Succeed" })

    } catch (error) {
        console.log("Error in Regsistring User".red.italic , error.message);
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Require ALL Fields" })
        }

        let user = await User.findOne({ email }).select("+passwordHash");

        if (!user || !(await user.correctPassword(password, user.passwordHash))) {
            return res.status(404).json({ messgae: "Incorrect Email or Password" });
        }

        createSendToken(user, 200, res)

    } catch (error) {
        console.log("Error Logging In", error.message.red.bold);
    }
}

const VerifyTokenController = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            console.log(data);
            try {
                const user = await User.findOne({ email: data.email });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json({ user, message: "Success" });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }

        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    VerifyTokenController
}