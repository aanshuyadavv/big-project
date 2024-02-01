const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require("./data")


main()
.then(()=>{
console.log('Connected to DB')    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async ()=>{
    await Listing.deleteMany({})

   initData.data = initData.data.map((obj)=>({
      ...obj,
      owner: "65aa6b0e9f59fb1afb8865cf"        // now "owner" key will be created in listing table
    }))

    await Listing.insertMany(initData.data)
    console.log('data was initialised')
};

initDB();