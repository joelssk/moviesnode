const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Movie = mongoose.model('movie',
    new mongoose.Schema({
        title: String,
        year: Number,
        rating: Number
    }), 'movies');

module.exports = {
    connect: function () {
        mongoose.connect('mongodb://localhost/moviedb');
    },
    disconnect: function () {
        mongoose.disconnect();
    },
    getMovies: function () {
        mongoose.connect('mongodb://localhost/moviedb');
        return Movie.find().exec();
    },
    addMovie: function (movieData) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        const movie = new Movie(movieData);
        return movie.save();
    },
    findMovieById: function (id) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        return Movie.findById(id).exec();
    },
    updateMovie: function (id, newMovie) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        return Movie.findById(id).exec()
            .then(movie => {
                movie.title = newMovie.title;
                movie.year = newMovie.year;
                movie.rating = newMovie.rating;
                return movie.save();
            });
    },
    deleteMovie: function (id) {
        mongoose.connect('mongodb://localhost/moviedb', {
            useMongoClient: true
        });
        return Movie.deleteOne({
            '_id': id
        });
    }
};