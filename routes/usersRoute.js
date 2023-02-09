const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/userController')
const verifyJWT = require('../midddleWear/verifyJwt')

router.use(verifyJWT)

router.route('/')
            .get(getAllUsers)
            .post(createUser)
            .patch(updateUser)
            .delete(deleteUser)

module.exports = router;