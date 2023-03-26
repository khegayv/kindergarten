const UserModel = require('../models/userModel')

// Profile controller
exports.profile = async (req, res) => {
    try {
        // Get the user's information from the database
        const user = await UserModel.findById(req.user.id)

        // Render the profile page with the user's name
        res.render('profile', { name: user.name })
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }
};