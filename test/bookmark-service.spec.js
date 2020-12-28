require('dotenv').config()
const { expect } = require("chai")
const BookmarkService = require('../src/bookmarks/bookmarks-service')
const knex = require('knex')

describe(`Bookmarks Service Object`, function() {
    let db
    let sampleBookmarks = [
        {
            id: 1,
            title: 'Google',
            url: 'https://www.google.com',
            rating: '5',
            description: 'Search the internet',
        },
        {
            id: 2,
            title: 'Twitter',
            url: 'https://www.twitter.com',
            rating: '2',
            description: 'Tweet your friends',
        },
        {
            id: 3,
            title: 'Thinkful',
            url: 'https://www.thinkful.com',
            rating: '5',
            description: 'Learn to code',
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('bookmarks').truncate())

    afterEach(() => db('bookmarks').truncate())

    after(() => db.destroy())

    

    after(() => db.destroy())

    context(`given 'bookmarks' has data`, () => {
        beforeEach(() => {
                return db
                    .into('bookmarks')
                    .insert(sampleBookmarks)
            })

        it(`getAllBookmarks() resolves all items from 'bookmarks' table`, () => {
            return BookmarkService.getAllBookmarks(db)
                .then(actual => {
                    expect(actual).to.eql(sampleBookmarks)
                })
        })

        it(`getById() resolves an article by id from 'bookmarks' table`, () => {
            const thirdId = 3
            const thirdBookmarkIndex = sampleBookmarks[thirdId - 1]
            return BookmarkService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdBookmarkIndex.title,
                        url: thirdBookmarkIndex.url,
                        rating: thirdBookmarkIndex.rating,
                        description: thirdBookmarkIndex.description,
                    })
                })
        })
    })  
    
    context(`given 'bookmarks' has no data`, () => {
        it(`getAllBookmarks() resolves an empty array`, () => {
            return BookmarkService.getAllBookmarks(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })

})