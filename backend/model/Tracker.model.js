import mongoose from "mongoose";

const trackerSchema = mongoose.Schema({
    date: {
        type: String,
        require: true,
    }, 
    category: {
        type: String,
        require: true,
    }, 
    amount: {
        type: Number,
        require: true,
    }, 
    paymentMethod: {
        type: String,
        require: true
    },
}, {
    timestamp: true
});

const trackerExpense = mongoose.model('Tracker', trackerSchema);

export default trackerExpense;