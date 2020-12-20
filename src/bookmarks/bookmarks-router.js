const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, desc } = req.body

        //validate required fields
        if (!title){
            logger.error('Title is required')
            return res
                .status(400)
                .send('Invalid Data')
        }
        if (!url){
            logger.error('URL is required')
            return res
                .status(400)
                .send('Invalid Data')
        }
        if (!rating){
            logger.error('Rating is required')
            return res
                .status(400)
                .send('Invalid Data')
        }
        if (!desc){
            logger.error('Description is required')
            return res
                .status(400)
                .send('Invalid Data')
        }

        //create id
        const id = uuid()

        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        }

        bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${id} created`)

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params
        const bookmark = bookmarks.find(bm => bm.id == id)

        //validate bookmark exists
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found`)
            return res
                .status(404)
                .send('Bookmark not found')
        }

        res.json(bookmark)
    })
    .delete((req, res) => {
        const { id } = req.params
        const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id)

        if (bookmarkIndex === -1){
            logger.error(`Card with id ${id} not found.`)
            return res
                .status(404)
                .send('Not found')
        }

        bookmarks.splice(bookmarkIndex, 1)

        logger.info(`Bookmark with id ${id} deleted`)
        res
            .status(204)
            .end()
    })

module.exports = bookmarksRouter