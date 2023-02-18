const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/users')

    //Get users
const getAllUsers = async (req, res) => {
    //Get all users
    const user = await User.find().select('-password').lean()

    //Check for users
    if(!user?.length){
        return res.status(400).json({ message: 'No users found' })
    }

    const userCount = user.length

    res.status(200).json({
        message: "Users found",
        user,
        userCount
    })
}

const createUser = async (req, res) => {
    const {username, password, role} = req.body
    //Confirm details
    if(!username || !password){
        return res.status(400).json({ message: 'All fields are required' })
    }

    //Duplicate check
    const duplicate = await User.findOne({username}).collation({locale:'en', strength:2}).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = (!Array.isArray(role) || !role.length)
    ? { username, "password": hashedPassword }
    : { username, "password": hashedPassword, role }

    //Create and store new user
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

const updateUser = async (req, res) => {
    const { id, username, role, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(role) || !role.length || typeof active !== 'boolean') {
        return res.status(400).json({ 
            message: 'All fields except password are required' 
        })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({locale:'en', strength:2}).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.role = role
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}