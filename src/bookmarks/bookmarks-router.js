const express = require('express')
const xss = require('xss')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')
const BookmarkService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    rating: bookmark.rating,
    description: xss(bookmark.description)
})

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarkService.getAllBookmarks(knexInstance)
            .then(bookmark => {
                res.json(bookmark.map(serializeBookmark))
             })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { title, url, rating, description } = req.body
        const newBookmark = { title, url, rating, description }

        for (const [key, value] of Object.entries(newBookmark))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        BookmarkService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                logger.info(`Bookmark with id ${bookmark.id} created`)
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)  
    })


bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .all((req, res, next) => {
        const { bookmark_id } = req.params
        BookmarkService.getById(
            req.app.get('db'),
            bookmark_id
        )
        .then(bookmark => {
            if(!bookmark) {
                return res.status(404).json({
                    error: { message: `Bookmark not found` }
                })
            }
            res.bookmark = bookmark
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        const { bookmark_id } = req.params
        BookmarkService.deleteBookmark(
            req.app.get('db'),
            bookmark_id
        )
        .then(() => {
            res.status(204).end()    
        })
        .catch(next)
    })


module.exports = bookmarksRouter