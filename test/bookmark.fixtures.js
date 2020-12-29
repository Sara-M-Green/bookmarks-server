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

function makeMaliciousBookmark() {
    const maliciousBookmark = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        url: 'https://www.hackers.com',
        rating: '1',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }

    const expectedBookmark = {
        ...maliciousBookmark,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }

    return {
        maliciousBookmark,
        expectedBookmark
    }
}

module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark,
}