const express = require('express')
const router = express.Router()
const {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
} = require('../controller/noteController')
const verifyJWT = require('../midddleWear/verifyJwt')

router.use(verifyJWT)

router.route('/')
            .post(createNewNote)
            .get(getAllNotes)
            .patch(updateNote)
            .delete(deleteNote)

module.exports = router;