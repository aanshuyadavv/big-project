const express = require('express')
const router = express.Router({ mergeParams: true }) // {mergeParams:true} is used because the parent 

//route "/listings/:id/reviews" in app.js was getting stopped at "/listings/:id" and only the "/reviews" 
// was getting passed to the child route but child route need parent route that is "/listings/:id/reviews"
// for functioning so for that reason {mergeParams:true} is used. 


const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require("../schema")
const Review = require('../models/review');
const Listing = require('../models/listing');
const { isLoggedIn, isreviewAuthor } = require('../middleware')

const reviewController = require("../controllers/reviews")


const validateReview = (req, res, next) => {

  let { error } = reviewSchema.validate(req.body)
  // console.log(error)

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    // console.log(errMsg)
    throw new ExpressError(404, errMsg)
  } else {
    next()
  }
}



//post route review

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))


// delete review route

router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;