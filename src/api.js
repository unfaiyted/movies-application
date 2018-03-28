//https://api.themoviedb.org/3/movie/550?api_key=0c3cf3e726b6d3566fbe38b74c239e5b

module.exports = {
    getMovies: (query, sort) => {
        if (sort !== '') {

        }
    return fetch(`/api/movies?q=${query}&_sort=${sort}`)
      .then(response => response.json());
    },
    getMovie: (id) => {
        return fetch(`/api/movies/${id}`)
            .then(response => response.json());
    },
    // Add new movie to website
    addMovie: (movie) => {
        return fetch(`/api/movies`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movie)
            }).then(response => response.json());

    },
    //Change value of data in movies
    editMovie: (id) => {

    },
    //Delete existing movie=
    deleteMovie: (id) => {
    // delete existing movies
        return fetch(`/api/movies/${id}`,
            {
                method: 'delete'
            })
            .then(response => response.json());

    },
    searchMovies: (query) => {
            return fetch('/api/movies',
                {  "q": query }
            )
                .then(response => response.json());
    },
    getMovieDBData: (external_id) => {
        const data= {
            "api_key": '0c3cf3e726b6d3566fbe38b74c239e5b',
            "langauge": 'en-US',
            "external_source": 'imdb_id'
        };

        return fetch(`https://api.themoviedb.org/3/find/${external_id}?api_key=${data.api_key}&language=${data.langauge}&external_source=${data.external_source}`)
            .then(response => response.json());
    },
    searchMovieDBData: (query) => {
        const data= {
            "api_key": '0c3cf3e726b6d3566fbe38b74c239e5b',
            "langauge": 'en-US',
            "external_source": 'imdb_id',
            "page": 1,
            "include_adult": false
        };

        query = encodeURIComponent(query);
        //https://api.themoviedb.org/3/search/movie?api_key=0c3cf3e726b6d3566fbe38b74c239e5b&language=en-US&query=American%20Pie
        return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${data.api_key}&language=${data.langauge}&query=${query}&include_adult=${data.include_adult}`)
            .then(response => response.json());

    },
    getFullMovieData: (movDB_id) => {
        const data= {
            "api_key": '0c3cf3e726b6d3566fbe38b74c239e5b',
        };

        return fetch(`https://api.themoviedb.org/3/movie/${movDB_id}?api_key=${data.api_key}`)
            .then(response => response.json());
    },
    addMovieData: (id, data) => {
        return fetch(`/api/movies/${id}/`,
            {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            }).then(response => response.json());
    },
};


