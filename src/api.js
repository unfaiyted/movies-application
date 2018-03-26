//https://api.themoviedb.org/3/movie/550?api_key=0c3cf3e726b6d3566fbe38b74c239e5b

module.exports = {
    getMovies: () => {
    return fetch('/api/movies')
      .then(response => response.json());
    },
    // Add new movie to website
    addMovie: () => {

    },
    //Change value of data in movies
    editMovie: (id) => {


    },
    //Delete existing movie=
    deleteMovie: (id) => {
    // delete existing movies

    }
};
