import mongoose from "mongoose";
import constants from "../constants.js";

const DB_NAME = constants.DB_NAME;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(
            `\n MongoDB Connected! DB Host: ${connectionInstance.connection.host}`
        );
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
