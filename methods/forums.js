// Posts a forum post to a topic
const https = require('https');
const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");

// Fetch authentithication stuff
const cookieAuth = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../auth/cookies.json')));

// Export method
module.exports = {
    post(topicID, body) {
        // Set request content
        let content = 'csrfmiddlewaretoken=a&body=' + body + '&AddPostForm=';

        // Configure headers
        let head = {
            'Host': 'scratch.mit.edu',
            'Referer': 'https://scratch.mit.edu/discuss/topic/' + topicID,
            'Connection': 'keep-alive',
            'Origin': 'https://scratch.mit.edu',
            'Content-Length': content.length,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0',
            'X-CSRFToken': 'a',
            'Cookie': cookieAuth.cookie
        };

        // Configure HTTP options
        let options = {
            method: 'POST',
            host: 'scratch.mit.edu',
            path: '/discuss/topic/' + topicID + '/?#reply',
            headers: head
        };

        // Prepare POST data
        var req = https.request(options, (res) => {
            if (res.statusCode === 403) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.statusCode === 500) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                return {
                    'code': res.statusCode,
                    'msg': 'Posted to topic ' + topicID,
                    'data': 'none'
                };
            }
        });
        
        // Handle Errors
        req.on('error', (e) => {
            console.error('API Error: ' + e);
        });
        
        // Send content and end request
        req.write(content);
        req.end();
    },
    edit(postID, body) {
        // Set request content
        let content = 'csrfmiddlewaretoken=' + cookieAuth.forums.csrfmiddleware + '&body=' + body;

        // Configure headers
        let head = {
            'Authorization': cookieAuth.forums.auth,
            'Host': 'scratch.mit.edu',
            'Referer': 'https://scratch.mit.edu/discuss/post/' + postID,
            'Connection': 'keep-alive',
            'Origin': 'https://scratch.mit.edu',
            'Content-Length': content.length,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0',
            'Cookie': cookieAuth.cookie,
            'Upgrade-Insecure-Requests': '1'
        };

        // Configure HTTP options
        let options = {
            method: 'POST',
            host: 'scratch.mit.edu',
            path: '/discuss/post/' + postID + '/edit',
            headers: head
        };

        // Prepare POST data
        var req = https.request(options, (res) => {
            if (res.statusCode === 403) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.statusCode === 500) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                return {
                    'code': res.statusCode,
                    'msg': 'Edited post ' + postID,
                    'data': 'none'
                };
            }
        });
        
        // Handle Errors
        req.on('error', (e) => {
            console.error('API Error: ' + e);
        });
        
        // Send content and end request
        req.write(content);
        req.end();
    },
    async getPostContent(topicID, postNum) { 
        const response = await fetch("https://scratch.mit.edu/discuss/topic/" + topicID + "/?page=" + (Math.floor(postNum / 10)+1))
        if (response.status === 403) {
                return {
                    'code': response.status,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.status === 500) {
                return {
                    'code': response.status,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                const pageHTML = await response.text();
                return {
                    'code': response.status,
                    'msg': 'Got post number ' + postNum + " from topic " + topicID,
                    'data': pageHTML.split('<div class="post_body_html">')[(postNum%10)+1].split('</div>')[0]
                };
            }
        },
        async getPostAuthor(topicID, postNum) { 
        const response = await fetch("https://scratch.mit.edu/discuss/topic/" + topicID + "/?page=" + (Math.floor(postNum / 10)+1))
        if (response.status === 403) {
                return {
                    'code': response.status,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.status === 500) {
                return {
                    'code': response.status,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                const pageHTML = await response.text();
                return {
                    'code': response.status,
                    'msg': 'Got author of post number ' + postNum + " from topic " + topicID,
                    'data': pageHTML.split('<a class="black username" href="/users/')[(postNum % 10)+1].split('/"')[0]
                };
            }
        },
        async getTopicTitle(topicID) { 
        const response = await fetch("https://scratch.mit.edu/discuss/topic/" + topicID)
        if (response.status === 403) {
                return {
                    'code': response.status,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.status === 500) {
                return {
                    'code': response.status,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                const pageHTML = await response.text();
                return {
                    'code': response.status,
                    'msg': 'Got title of topic ' + topicID,
                    'data': pageHTML.split('<title>')[1].split('</title>')[0]
                };
            }
        },
         followTopic(topicID) {
        // Set request content
        let content = 'csrfmiddlewaretoken=a';

        // Configure headers
        let head = {
            'Host': 'scratch.mit.edu',
            'Referer': 'https://scratch.mit.edu/discuss/subscription/topic/' + topicID + '/add',
            'Connection': 'keep-alive',
            'Origin': 'https://scratch.mit.edu',
            'Content-Length': content.length,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0',
            'X-CSRFToken': 'a',
            'Cookie': cookieAuth.cookie
        };

        // Configure HTTP options
        let options = {
            method: 'POST',
            host: 'scratch.mit.edu',
            path: "/discuss/subscription/topic/" + topicID + "/add/",
            headers: head
        };

        // Prepare POST data
        var req = https.request(options, (res) => {
            if (res.statusCode === 403) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.statusCode === 500) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                return {
                    'code': res.statusCode,
                    'msg': 'Followed topic ' + topicID,
                    'data': 'none'
                };
            }
        });
        
        // Handle Errors
        req.on('error', (e) => {
            console.error('API Error: ' + e);
        });
        
        // Send content and end request
        req.write(content);
        req.end();
    },
    unfollowTopic(topicID) {
        // Set request content
        let content = 'csrfmiddlewaretoken=a';

        // Configure headers
        let head = {
            'Host': 'scratch.mit.edu',
            'Referer': 'https://scratch.mit.edu/discuss/subscription/topic/' + topicID + '/delete',
            'Connection': 'keep-alive',
            'Origin': 'https://scratch.mit.edu',
            'Content-Length': content.length,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0',
            'X-CSRFToken': 'a',
            'Cookie': cookieAuth.cookie
        };

        // Configure HTTP options
        let options = {
            method: 'POST',
            host: 'scratch.mit.edu',
            path: "/discuss/subscription/topic/" + topicID + "/delete/",
            headers: head
        };

        // Prepare POST data
        var req = https.request(options, (res) => {
            if (res.statusCode === 403) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Invalid auth',
                    'data': 'none'
                };
            } else if (res.statusCode === 500) {
                return {
                    'code': res.statusCode,
                    'error-msg': 'Server issues',
                    'data': 'none'
                };
            } else {
                return {
                    'code': res.statusCode,
                    'msg': 'Followed topic ' + topicID,
                    'data': 'none'
                };
            }
        });
        
        // Handle Errors
        req.on('error', (e) => {
            console.error('API Error: ' + e);
        });
        
        // Send content and end request
        req.write(content);
        req.end();
    },
}
