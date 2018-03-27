//https://api.themoviedb.org/3/movie/550?api_key=0c3cf3e726b6d3566fbe38b74c239e5b

module.exports = {
    getMovies: () => {
    return fetch('/api/movies')
      .then(response => response.json());
    },
    // Add new movie to website
    addMovie: (movieObject) => {

    },
    //Change value of data in movies
    editMovie: (id) => {


    },
    //Delete existing movie=
    deleteMovie: (id) => {
    // delete existing movies

    },
    getMovieDBData: (external_id) => {
        const data= {
            "api_key": '0c3cf3e726b6d3566fbe38b74c239e5b',
            "langauge": 'en-US',
            "external_source": 'imdb_id'
        };

        return fetch(`https://api.themoviedb.org/3/find/${external_id}?api_key=${data.api_key}&language=${data.langauge}&external_source=${data.external_source}`)
            .then(response => response.json());

    }
};
