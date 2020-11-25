import mongoose from 'mongoose';

const { Schema } = mongoose;

// define item schema
const itemSchema = new mongoose.Schema({
    productId: Number,
    title: String,
    manufacturer: String,
    quantity: Number,
    weight: String,
    location: {
        wsection: String,
        wshelf: Number,
        wrow: Number
    },
    arrival: String,
    departure_scheduled: String
})

itemSchema.methods.update

export default mongoose.model('Item', itemSchema, 'test-items');