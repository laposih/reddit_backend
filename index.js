const express = require('express');
const bodyParser = require('body-parser');
const db = require('./mysql-db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.send('hello world');
});

// app.get('/posts', function (req, res) {
//         db.getPosts(function (dbPosts) {
//             if (dbPosts) {
//                 res.send({
//                     posts: dbPosts
//                 });
//             } else {
//                 res.status(500).send({
//                     message: 'Cannot read from database'
//                 });
//             }
//         });
//     });

app.get('/posts', handlePosts); 

function handlePosts(req, res) {
    function sendResponse(dbPosts) {
        if (dbPosts) {
            res.send({
                posts: dbPosts
            });
        } else {
            res.status(500).send({
                message: 'Cannot read from database'
            });
        }
    };
    db.getPosts(sendResponse);
}

app.post('/posts', (req, res) => {
    // function sendRseponse(newPost) {
    //     if (newPost) {
    //         res.send(newPost);
    //     }
    // }

    db.addPosts(req.body, (newPost) => {
        if (newPost) {
            res.send(newPost);
        } else {
            res.status(500).send({
                message: 'Cannot read from database'
            });
        }
    });
});

function vote(req, res, voteDirection) {
    db.getPost(req.params.id, (post) => {
        if (!Array.isArray(post)) {
            db.changeScore(voteDirection, req.params.id, (updatedPost) => {
                if (updatedPost) {
                    res.send(updatedPost);
                } else {
                    res.status(500).send({
                        message: 'Could not update post'
                    });
                }
            });
        } else {
            res.status(404).send({
                message: 'Id not found'
            });
        }
    });
}

app.put('/posts/:id/upvote', (req, res) => {
    vote(req, res, 1);
});

app.put('/posts/:id/downvote', (req, res) => {
    vote(req, res, -1);
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});