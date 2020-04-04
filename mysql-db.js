const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'reddit',
  insecureAuth: true
});

function getPosts(fnHandlePosts) {
    conn.query('select id, title, url, UNIX_TIMESTAMP(createdAt) as timestamp, score from posts;', (err, rows) => {
        if (err) {
            console.log(err);
            fnHandlePosts();
        } else {
            fnHandlePosts(rows);
        }
    });
}

function addPosts(post, fnHandleNewPost) {
    createdAt = new Date();
    defaultScore = 0;
    conn.query('INSERT INTO reddit.posts(title, url, createdAt, score) VALUES(?, ?, ?, ?);', [post.title, post.url, createdAt, defaultScore], (error, result) => {
        if (error) {
            console.log(error);
            fnHandleNewPost();
        } else {
            let res = {                       //replace with getPost!!!!
                id: result.insertId,
                title: post.title,
                url: post.url,
                timestamp: Date.parse(createdAt.toString())/1000,
                score: defaultScore
            }
            fnHandleNewPost(res);
        }
    });
}

// function changeScore(voteDirection, id, fnHandleAfterUpdate) {
//     conn.query('update reddit.posts set score = (select score from (select * from reddit.posts) as myPosts where id = ?) + ? where id = ?;', [id, voteDirection, id], (err, result) => {
//         if (err) {
//             console.log(err);
//             fnHandleAfterUpdate();
//         } else {
//             fnHandleAfterUpdate(getPost);
//         }
//     });
// }

function changeScore(voteDirection, id, fnHandleUpdatedPost) {
    conn.query('update reddit.posts set score = (select score from (select * from reddit.posts) as myPosts where id = ?) + ? where id = ?;', [id, voteDirection, id], (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            fnHandleUpdatedPost();
        } else {
            getPost(id, (post) => {
                if (post) {
                    fnHandleUpdatedPost(post);
                } else {
                    fnHandleUpdatedPost();
                }
            });
        }
    });
}

function getPost(id, callback) {
    conn.query('select * from reddit.posts where id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            callback();
        } else {
            console.log(result);
            callback(result);
        }
    })
}

module.exports = {
    getPosts,
    addPosts,
    changeScore,
    getPost
}
