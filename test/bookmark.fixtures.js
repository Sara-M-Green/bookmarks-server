function makeBookmarksArray() {
    return [
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
        }
    ]
}

module.exports = {
    makeBookmarksArray
}