/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const {sayHello} = require('./hello.js');

sayHello('Dane');

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);

      $('<div class="movie">').append(
          $('<div class="movie-id">').text(id),
          $('<div class="movie-title">').text(title),
          $('<div class="movie-rating">').text(rating)
      ).appendTo('#moviesList');


      $('.loading-container').hide();


  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});
