const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  const movieId = request.params.movieId;
  const movie = await service.read(movieId);

  if (movie) {
    response.locals.movie = movie;
    next();
  } else {
    next({
      status: 404,
      message: `Movie cannot be found.`
    })
  }
}

async function read(request, response) {
  // TODO: Add your code here
  const movie = response.locals.movie;
  response.status(200).json({ data: movie });
}

async function list(request, response) {
  // TODO: Add your code here.
  const { is_showing } = request.query;
  const list = await service.list(is_showing);
  response.status(200).json({ data: list });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
