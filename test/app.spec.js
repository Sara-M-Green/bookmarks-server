const app = require('../src/app')

describe('App', () => {
    it('Get / responds with 200 containing "Hello, boilerplate!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, boilerplate!')
    })
})