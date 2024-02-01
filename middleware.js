const Listing = require('./models/listing');
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listing")
        return res.redirect("/login")
    }
    next()

}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    // console.log(id)
    let listing = await Listing.findById(id)

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing")
        return res.redirect(`/listings/${id}`) // if you don't write "return" here then the below code will run 
        // and updation will happen
    }
    next()
}

module.exports.isreviewAuthor = async (req, res, next) => {
    const { id , reviewId} = req.params;
    // console.log(id)
    let review = await Review.findById(reviewId)

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`) // if you don't write "return" here then the below code will run 
        // and updation will happen
    }
    next()
}

