/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const $ = require('jquery');
const {getMovies, getMovieDBData, deleteMovie, addMovie, addMovieData, getMovie} = require('./api.js');
const {sayHello} = require('./hello.js');

let delay = makeDelay(250);

sayHello('Dane');

function movieList(query, sortBy) {
    if (typeof query === 'undefined') { query = ''; }
    if (typeof sortBy === 'undefined') { sortBy = ''; }

    getMovies(query, sortBy).then((movies) => {
        //console.log('Here are all the movies:');
        movies.forEach(({title, rating, id, tvdb}) => {
//    console.log(`id#${id} - ${title} - rating: ${rating}`);

            let moviePoster = "images/placeholder.png"
            let movieBackdrop = "";

            if (tvdb) {
                console.log('data exists for tvdb');
                moviePoster = 'https://image.tmdb.org/t/p/w500/' + tvdb.poster_path;
                movieBackdrop = 'https://image.tmdb.org/t/p/original/' + tvdb.backdrop_path;

            }

            $(`<div class="movie p-2 m-2" id="movie-${id}">`).append(
                $('<div class="movie-img">').append(
                    $(`<img src="${moviePoster}" id="img-${id}" class="img-fluid main">`)),
                $('<div class="movie-title text-truncate">').text(title),
                $('<div class="movie-database">').append(
                    $(`<img src="images/loader.svg" class="loading-data hide" id="loading-movie-${id}">`).text(''),
                    $(`<button id="update-movie-${id}" class="update" value="${id}">`).html("<i class=\"material-icons\">autorenew</i>"),
                    $(`<button id="edit-movie-${id}" class="edit" value="${id}">`).html('<i class="material-icons">create</i>'),
                    $(`<button id="delete-movie-${id}" class="delete" value="${id}">`).html('<i class="material-icons">delete_forever</i>'),
                )).appendTo('#moviesList');


            $(`#img-${id}, #update-movie-${id}, #edit-movie-${id}, #delete-movie-${id}`).hover(function () {
                $('.bg-container').css('background-image', `url('${movieBackdrop}')`);
                $(`#img-${id}`).addClass('standard-hover');
                $(`#update-movie-${id}`).css('opacity',1);
                $(`#edit-movie-${id}`).css('opacity',1);
                $(`#delete-movie-${id}`).css('opacity',1);

            }, function () {
                $(`#update-movie-${id}`).css('opacity',0);
                $(`#edit-movie-${id}`).css('opacity',0);
                $(`#delete-movie-${id}`).css('opacity',0);
                $(`#img-${id}`).removeClass('standard-hover');

            });

            $(`#img-${id}`).click(function() {
                $("#movie-full").removeClass('hide');
            });

            $(`#delete-movie-${id}`).click(function () {

                // TODO: reaplce this with a in-page function
                const confirmed = window.confirm("Are you sure");

                if (confirmed === true) {
                    $(`#movie-${id}`).addClass('hide');
                    deleteMovie(id);
                    console.log(`deleted: ` + id);


                } else {
                    console.log(`cancelled the delete: ` + id);
                }

            });

            $(`#update-movie-${id}`).click(function (e) {
                e.preventDefault();
                $(`#loading-movie-${id}`).removeClass('hide');
                $(`#img-${id}`).addClass('loading-hover');

                const movieId = $(this).val();

                $(this).off('click');

                setTimeout(function () {
                    getMovieDBData(movieId).then((movies) => {
                        console.log('Here are all the movies:');
                        console.log(movies.movie_results[0]);

                        const movie = movies.movie_results[0];

                        addMovieData(id,
                            {
                                title: movie.title,
                                rating: movie.vote_average,
                                tvdb: movie
                            });

                        $(`#img-${id}`).attr('src', `https://image.tmdb.org/t/p/w500/${movie.poster_path}`);
                        $('.bg-container').css('background-image', `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`);

                        $(`#img-${id}`).hover(function () {
                            $('.bg-container').css('background-image', `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`);
                        });

                        $(`#loading-movie-${id}`).addClass('hide');
                        $(`#img-${id}`).removeClass('loading-hover');


                    }).catch((error) => {
                        alert('Oh no! Something went wrong.\nCheck the console for details.');
                        console.log(error);
                    });

                    $(this).on('click');

                    $('.loading-container').hide();
                }, 3000);

            });

            $('.loading-container').hide();

        });

    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};


$(`#submit-new-movie`).click(function (e) {
    e.preventDefault();
    console.log('adding movie');

    // let movie = new FormData();
    //
    // movie.append("title","Test Movie");
    // movie.append("rank","3");
    // movie.append("id","tt0054215");
    // movie.append("rating",8);8

   const movie = {
        "title": "Test Movie",
        "rank": "30",
        "imdb-id": "tt0054215",
        "rating": 8
    };


    console.log(JSON.stringify(movie));
    addMovie(movie);

});




$('#search-movies').on('input', function () {

    delay(function () {
            console.log($('#search-movies').val());

        $('.loading-container').show();

            $('#moviesList').empty();
            movieList($('#search-movies').val());

        }

    );


});

$("body").keyup(function(e) {
    (e.keyCode === 27) ? $('#movie-full').addClass('hide') : false;
});

$('.sort-menu').click(function () {

    $('.sort-menu').attr('aria-selected','false');
    $(this).attr('aria-selected','true');

   console.log($(this).attr('name'));

    $('#moviesList').empty();
    movieList($('#search-movies').val(),$(this).attr('name'));

});

/* current time */
setInterval(function () {

        var d = new Date;
        var hours = d.getHours(); // call methods on your instance d
        var mins = d.getMinutes();
        if (hours > 12) {
            var hour = (hours - 12);
            var ampm = "PM";
        }
        else {
            var hour = hours;
            var ampm = "AM";
        }
        var time = hour + ":" + mins + ampm; // string concatenate ampm
        $("#clock").html(time);

    }, 1000);


// Generates default movie list
movieList();
