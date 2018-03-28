/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const $ = require('jquery');
const {getMovies, getMovieDBData, deleteMovie, addMovie, addMovieData, getFullMovieData, getMovie, searchMovieDBData} = require('./api.js');
const {sayHello} = require('./hello.js');

let delay = makeDelay(1000);

sayHello('Dane');

function setFav() {

}

// Creates the primary movie list
function movieList(query, sortBy, order) {

    getMovies(query, sortBy, order).then((movies) => {
        //console.log('Here are all the movies:');
        movies.forEach(({title, rating, id, tvdb, imdb_id}) => {
//    console.log(`id#${id} - ${title} - rating: ${rating}`);

            let moviePoster = "images/placeholder.png";
            let movieBackdrop = "";

            if (tvdb) {
                console.log('data exists for tvdb');
                if(tvdb.poster_path !== null) moviePoster = 'https://image.tmdb.org/t/p/w500/' + tvdb.poster_path;
                if(tvdb.backdrop_path !== null) movieBackdrop = 'https://image.tmdb.org/t/p/original/' + tvdb.backdrop_path;

            }

            $(`<div class="movie p-2 m-2" id="movie-${id}">`).append(
                $('<div class="movie-img">').append(
                    $(`<img src="${moviePoster}" id="img-${id}" class="img-fluid main">`)),
                $('<div class="movie-title text-truncate">').text(title),
                $('<div class="movie-database">').append(
                    $(`<img src="images/loader.svg" class="loading-data hide" id="loading-movie-${id}">`).text(''),
                    $(`<input type="hidden" id="movie-imdb-${id}"  value="${imdb_id}">`).text(''),
                    $(`<button id="update-movie-${id}" class="update" value="${id}">`).html("<i class=\"material-icons\">autorenew</i>"),
                    $(`<button id="edit-movie-${id}" class="edit" value="${id}">`).html('<i class="material-icons">create</i>'),
                    $(`<button id="delete-movie-${id}" class="delete" value="${id}">`).html('<i class="material-icons">delete_forever</i>'),
                    $(`<button id="fav-movie-${id}" class="favorite" value="${id}">`).html('<i class="material-icons">star_border</i>'),
                )).appendTo('#moviesList');


            $(`#img-${id}, #update-movie-${id}, #edit-movie-${id}, #delete-movie-${id}, #fav-movie-${id}`).hover(function () {
                $('.bg-container').css('background-image', `url('${movieBackdrop}')`);
                $(`#img-${id}`).addClass('standard-hover');
                $(`#update-movie-${id}, #edit-movie-${id}, #delete-movie-${id}, #fav-movie-${id}`).css('opacity',0.6);

            }, function () {
                $(`#update-movie-${id}, #edit-movie-${id}, #delete-movie-${id}, #fav-movie-${id}`).css('opacity',0.0);
                $(`#img-${id}`).removeClass('standard-hover');

            });

            $(`#img-${id}`).click(function() {
                     displayMovie(id);
            });

            $(`#fav-movie-${id}`).click(function() {
                    setFav(id);
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

                const movieId = $(`#movie-imdb-${id}`).val();

                $(this).off('click');

                setTimeout(function () {
                    getMovieDBData(movieId).then((movies) => {
                        console.log('Here are all the movies:');
                        console.log(movies.movie_results[0]);

                        const movie = movies.movie_results[0];


                        getFullMovieData(movie.id).then(movie => {


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

                        });





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

// Pulls relevent movie data and displays full screen
function displayMovie(id) {

    //Loading Spinner
    getMovie(id).then(movie => {
        const m = movie;

        console.log(m);

        $(`#movie-big-img`).attr('src', `https://image.tmdb.org/t/p/w500/${m.tvdb.poster_path}`);
        $('#movie-overview').text(m.tvdb.overview);
        $('#movie-big-title').text(m.title);
        $('#movie-big-rating').text(m.rating);
        $('#movie-big-votes').text(m.tvdb.vote_count);
        $('#movie-big-genres').text(function () {
            let list =  ''
            m.tvdb.genres.forEach(function (item) {
               list += item.name +', '
            });
            return list;
        });
        $('#movie-big-release').text(m.tvdb.release_date);
        $('#movie-big-tagline').text(m.tvdb.tagline);
        // $('#movie-big-release-date').text(m.tvdb.release_date);
        $("#movie-full").removeClass('hide');
        // Display movie info

    });


}

// Delay function to prevent too many requests sent to server repeatedly.
function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};

function limitStrLength(string, maxLen) {

    let len = string.length;

    if(len>maxLen)
    {
        return(string.substr(0,maxLen)+'...');
    }

    return string;

}

// Add Movie
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



const callbackSearchMovie = function () {
    //clear last search data.
        $('#movie-search-list').empty();
        $('.find-movie-loader').show();

        let query = $('#movie-search-input').val();

        //add movies
        searchMovieDBData(query).then((movies) => {

            console.log(movies.results);

            movies.results.forEach((movie) => {

                $('.find-movie-loader').hide();

                $(`<div class="movie-search p-2 m-2 row" id="movie-${movie.id}">`).append(
                    $('<div class="movie-search-img col-3">').append(
                        $(`<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" id="img-${movie.id}" class="img-fluid main">`)),
                    $('<div class="movie-search-title col-8">').text(movie.title).append(
                        $(`<p class="movie-search-overview">`).text(limitStrLength(movie.overview, 200)),
                        $(`<p class="movie-search-year">`).text(movie.release_date.substr(0,4))),
                    $('<div class="movie-search-database col-1">').append(
                        $(`<img src="images/loader.svg" class="loading-data hide" id="loading-movie-${movie.id}">`).text(''),
                        $(`<input type="hidden" id="id-${movie.id}"  value="${movie.id}">`).text(''),
                        $(`<button id="add-movie-${movie.id}" class="add" value="${movie.id}">`).html('<i class="material-icons">add</i>'),
                    )).appendTo('#movie-search-list');


                $(`#add-movie-${movie.id}`).click(function () {

                    $(this).prop('disabled', true);
                    $(this).html("&nbsp;");
                    $(this).addClass('loader-bg');

                    //$(this).addClass('hide').append($(`<img src="images/loader.svg" class="img-fluid">`).text());

                    getFullMovieData($(this).val()).then((movie) => {

                        addMovie({
                            title: movie.title,
                                rating: movie.vote_average,
                            tvdb: movie
                        }).then((response) => {

                          console.log(response);
                          console.log('movie added?');

                            $(this).removeClass('loader-bg');
                            $(`#add-movie-${movie.id}`).html('<i class="material-icons">check</i>').removeClass('hide');

                          // reload movie list
                            $('#moviesList').empty();
                            movieList();

                        });

                    });

                });

            });
        });


    }
    //display none found dialog

$('#find-movies').click(callbackSearchMovie);
$("#movie-search-input").keypress(function() {
    if (event.which == 13) callbackSearchMovie();
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

$('.back-full').click(function() {
   $('#movie-full').addClass('hide');
});

$('.sort-menu').click(function () {

    $('.sort-menu').attr('aria-selected','false');
    $(this).attr('aria-selected','true');


    let order = 'asc';

    $(this).children('i').text(function(parent, arrow) {
        $('i.arrow-right').text('');
        order = (arrow === 'arrow_drop_up') ? 'asc' : 'desc';
        return (arrow === 'arrow_drop_up') ? 'arrow_drop_down' : 'arrow_drop_up';
    });



   console.log($(this).attr('name'));

    $('#moviesList').empty();

    console.log(order);
    movieList($('#search-movies').val(),$(this).attr('name'), order);

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


