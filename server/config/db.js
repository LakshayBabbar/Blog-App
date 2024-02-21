import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("connected to database successfully.") 
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;