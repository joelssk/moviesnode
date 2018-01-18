const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const Movie = mongoose.model('movie',
    new mongoose.Schema({
        title: String,
        year: Number,
        rating: Number
    }), 'movies');



console.log('hello world');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.route('/')
    .get(function (req, res) {
        mongoose.connect('mongodb://localhost/moviedb');
        Movie.find().exec(function (err, movies) {
            if (err) {
                res.send('error' + err);
                return;
            }
            res.send(movies);
            mongoose.disconnect();
        });
    })
    .post(function (req, res) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        const movie = new Movie(req.body);
        movie.save().then(function () {
                res.status(200).send();
                mongoose.disconnect();
            })
            .catch(function (err) {
                res.status(400).send('unable to save');
                mongoose.disconnect();
            });
    });
app.route('/:id')
    .get(function (req, res) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        Movie.findById(req.params.id).exec((err, movie) => {
            if (err) {
                res.status(400).send('id not found' + err);
                mongoose.disconnect();
                return;
            }
            if (!movie) {
                res.sendStatus(404);
                mongoose.disconnect();
                return;
            }
            res.send(movie);
            mongoose.disconnect();
        });
    })
    .put(function (req, res) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        Movie.findById(req.params.id).exec((err, movie) => {
            if (err) {
                res.status(400).send('id not found' + err);
                return;
            }
            movie.title = req.body.title;
            movie.year = req.body.year;
            movie.rating = req.body.rating;
            movie.save().then(function () {
                    res.status(200).send();
                    mongoose.disconnect();
                })
                .catch(function (err) {
                    res.status(400).send('unable to save');
                    mongoose.disconnect();
                });
        });
    })
    .delete((req, res) => {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        Movie.deleteOne({
                '_id': req.params.id
            })
            .then(() => {
                res.sendStatus(200);
                mongoose.disconnect();
            })
            .catch(err =>{
                res.status(400).send('did not delete'+ err);
                mongoose.disconnect();
            });
    });

app.listen(4200, function () {
    console.log('listening');

});