const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')
const BookmarkService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarkService.getAllBookmarks(knexInstance)
            .then(articles => {
                res.json(articles)
             })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, description } = req.body

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
            description
        }

        bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${id} created`)

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)
    })


bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res, next) => {
        const { bookmark_id } = req.params
        const knexInstance = req.app.get('db')
        BookmarkService.getById(knexInstance, bookmark_id)
        //const bookmark = bookmarks.find(bm => bm.id == id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark not found`)
                    return res
                        .status(404)
                        .send('Bookmark not found')
                }
                res.json(bookmark)    
            })
            .catch(next)
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