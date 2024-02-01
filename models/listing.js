const mongoose = require('mongoose');
const Review = require("../models/review");
const User = require('./user');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        
        url: String,
        filename : String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"          //table/collection/model
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"                          // this will not create a "owner" key in listing, for creation
        // of key reinitilaze data in index.js

    }
})


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;