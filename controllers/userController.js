const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel')

// Registration controller
exports.register = async (req, res) => {
    try {
        const { name, surname, email, password} = req.body

        // Check if email and password are provided
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide email and password' })
            console.log('no data')
            return;
        }

        // Check if user with the email already exists
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }

        // Hash the password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create the user
        const newUser = new UserModel({ name, surname, email, password: hashedPassword})
        await newUser.save()

        // Create a JWT token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(201).json({ result: newUser, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error)
    }
}

// Login controller
exports.login = async (req, res) => {
    const { email, password, role } = req.body
    console.log(req.body)

    try {

        // Check if email and password are provided
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide email and password' })
            console.log('no data')
            return;
        }

        // Check if user with email exists
        const user = await UserModel.findOne({ email })
        if (!user) {
            res.status(400).json({ success: false, message: 'User with this email does not exist' })
            console.log('exist')
            return;
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            res.status(400).json({ success: false, message: 'Incorrect password' })
            console.log('pass')
            return;
        }

        // Create a JWT token
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        // req.session.user = user // set user property on session object

        if (user.role === 'Admin') {
            res.cookie('token', token, { httpOnly: true });
            return res.redirect('/admin');
        } else {
            res.cookie('token', token, { httpOnly: true });
            return res.redirect('/');
        }
    } catch (error) {
        //res.status(500).json({ message: 'Something went wrong' })
        console.log(error)
    }
}

exports.logout = (req, res) => {
    try {
        // Clear the cookie on the client
        res.clearCookie('jwt')

        // Send a success response
        res.status(200).json(res.redirect('/'))
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error);
    }
}