/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const $ = require('jquery');
const {getMovies, getMovieDBData} = require('./api.js');
const {sayHello} = require('./hello.js');

sayHello('Dane');

getMovies().then((movies) => {
    //console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
//    console.log(`id#${id} - ${title} - rating: ${rating}`);


        $('<div class="movie p-2 m-2">').append(
            $('<div class="movie-img">').append(
                $(`<img src="images/placeholder.png" id="img-${id}" class="img-fluid main">`)),
            $('<div class="movie-title text-truncate">').text(title),
            // $('<div class="movie-rating">').text(rating),
            $('<div class="movie-database">').append(
                $(`<img src="images/loader.svg" class="loading-data hide" id="loading-movie-${id}">`).text(''),
                $(`<button id="update-movie-${id}" class="update" value="${id}">`).html("<i class=\"material-icons\">autorenew</i>"),
                $(`<button id="edit-movie-${id}" class="edit" value="${id}">`).html('<i class="material-icons">create</i>'),
                $(`<button id="delete-movie-${id}" class="delete" value="${id}">`).html('<i class="material-icons">delete_forever</i>'),
            )).appendTo('#moviesList');





        $(`#update-movie-${id}`).click(function (e) {
            e.preventDefault();
            $(`#loading-movie-${id}`).removeClass('hide');
            console.log($(this).val());

            const movieId = $(this).val();

            $(this).off('click');

            setTimeout(function () {
                getMovieDBData(movieId).then((movies) => {
                    console.log('Here are all the movies:');
                    console.log(movies.movie_results[0]);

                    const movie = movies.movie_results[0];

                    $(`#img-${id}`).attr('src',`https://image.tmdb.org/t/p/w500/${movie.poster_path}`);
                    $('.bg-container').css('background-image',`url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`);
                    $(`#loading-movie-${id}`).addClass('hide');



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

