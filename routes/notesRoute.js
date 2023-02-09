const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleWear/verifyJWT')
const {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
} = require('../controller/noteController')

router.use(verifyJWT)

router.route('/')
            .post(createNewNote)
            .get(getAllNotes)
            .patch(updateNote)
            .delete(deleteNote)

module.exports = router;