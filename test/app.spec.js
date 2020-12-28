const supertest = require('supertest')
const app = require('../src/app')

describe('App', () => {
    it('Get / responds with 200 containing "Bookmarks App!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Bookmarks App!')
    })
})

describe('/bookmarks', () => {
    it('Get /bookmarks returns with a status of 200', () => {
        return supertest(app)
            .get('/bookmarks')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200)
    })
} )