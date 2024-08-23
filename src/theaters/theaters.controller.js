const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  const movieId  = request.params.movieId;
  const data = await service.list();

  if (movieId) {
    response.json({
      data: data
          .filter((theater) =>
              theater.movies.find((movie) => movie.movie_id == movieId)
          )
          .map((theater) => {
            const newTheater = { ...theater, movie_id: movieId };
            delete newTheater["movies"];
            return newTheater;
          }),
    });
  } else {
    response.json({
      data: data,
    });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
