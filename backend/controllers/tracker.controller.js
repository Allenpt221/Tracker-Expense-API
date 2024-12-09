import mongoose from "mongoose";
import tracker from "../model/Tracker.model.js";


export const addTracker = async (req, res) => {
    const {date, category, amount, paymentMethod} = req.body;
    try {
        
        if(!date || !category || !amount || !paymentMethod){
            return res.status(490).json({success: false, message: 'All is required to fill up'});
        }
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/;
        
        if (!datePattern.test(date)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Please use MM/DD/YY.' });
        }
        const [month, day, year] = date.split('/');
        
        const formattedDate = new Date(`20${year}-${month}-${day}`);

        const newTacker = new tracker({date:formattedDate , category, amount, paymentMethod});
        
        await newTacker.save();

        return res.status(200).json({success: true, message: 'Successfully Tracker Expense Added'});
    } catch (error){
        console.error('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Error Server'});
    }
};

export const showAllExpense = async (req, res) => {
    try {

        const trackerExp = await tracker.find({});
        if(trackerExp.length === 0){
            return res.status(404).json({success: false, message: 'No expenses found in the collection.'});
        }

        return res.status(200).json({success: true, data: trackerExp, count: trackerExp.length});
    } catch (error){
        console.error('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Error Server'});
    }
};

export const removeExpense = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(500).json({success: false, message: 'Id not found'});
    }
    try {
        await tracker.findByIdAndDelete(id);

        return res.status(200).json({success: true, message: 'Successfully Delete Expense'});
    } catch (error){
        console.error('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Error Server'});
    }
};

export const updateExpense = async (req, res) => {
    const { id } = req.params;
    const {date, category, amount, paymentMethod} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success: false, message: 'Id not found'});
    }

    try { 
        const findExpense = await tracker.findById(id);
        if(!findExpense){
             return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/;
        
        if (!datePattern.test(date)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Please use MM/DD/YY.' });
        }
        const [month, day, year] = date.split('/');
        const formattedDate = new Date(`20${year}-${month}-${day}`);

        const updatedExpense = await tracker.findByIdAndUpdate(
            id,
            { date: formattedDate, category, amount, paymentMethod },
            { new: true }
        );
        return res.status(200).json({success: true, data: updatedExpense});
    } catch(error){
        console.error('Error Server', error.message);
        return res.status(500).json({success: false, message: 'Error Server'});
    }
};