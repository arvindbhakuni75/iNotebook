const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/iNotebook";

mongoose.set('strictQuery', true);

const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=> {
        console.log("Connected to mongodb successfuly");
    });
};



module.exports = connectToMongo;