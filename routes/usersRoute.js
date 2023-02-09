const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleWear/verifyJWT')
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/userController')


router.use(verifyJWT)

router.route('/')
            .get(getAllUsers)
            .post(createUser)
            .patch(updateUser)
            .delete(deleteUser)

module.exports = router;