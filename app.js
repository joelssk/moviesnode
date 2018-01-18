const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const dataAccess = require('./data-access');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.route('/')
    .get((req, res) => {
        dataAccess.getMovies()
            .then(movies => {
                res.send(movies);
                dataAccess.disconnect();
            })
            .catch(err => {
                res.send('error' + err);
                dataAccess.disconnect();
            });
    })
    .post((req, res) => {
        dataAccess.addMovie(req.body)
            .then(() => {
                res.status(200).send();
                dataAccess.disconnect();
            })
            .catch(err => {
                res.status(400).send('unable to save');
                dataAccess.disconnect();
            });
    });

app.route('/:id')
    .get((req, res) => {
        dataAccess.findMovieById(req.params.id)
            .then(movie => {
                if (!movie) {
                    res.sendStatus(404);
                    dataAccess.disconnect();
                    return;
                }
                res.send(movie);
                dataAccess.disconnect();
            })
            .catch(err => {
                res.status(400).send('id not found' + err);
                dataAccess.disconnect();
            });
    })
    .put((req, res) => {
        dataAccess.updateMovie(req.params.id, req.body)
            .then(() => {
                res.status(200).send();
                dataAccess.disconnect();
            })
            .catch(err => {
                res.status(400).send('unable to save' + err);
                dataAccess.disconnect();
            });
    })
    .delete((req, res) => {
        dataAccess.deleteMovie(req.params.id)
            .then(() => {
                res.sendStatus(200);
                dataAccess.disconnect();
            })
            .catch(err => {
                res.status(400).send('did not delete' + err);
                dataAccess.disconnect();
            });
    });

app.listen(4200, function () {
    console.log('listening');

});