const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
    const reviewId = request.params.reviewId;
    const review = await service.read(reviewId);

    if(review) {
      response.locals.review = review;
      next();
    } else {
      next({
        status: 404,
        message: `Review cannot be found ${reviewId}`,
      });
    }

}

async function destroy(request, response) {
  // TODO: Write your code here
  const reviewId = request.params.reviewId;
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  const movieId = request.params.movieId;
  const reviews = await service.list(movieId);
  response.status(200).json({ data: reviews });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const updatedReviewInDB = await service.update(updatedReview);
  response.status(200).json({ data: updatedReviewInDB });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
