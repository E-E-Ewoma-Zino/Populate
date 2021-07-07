// set up db

const mongoose = require("mongoose");

const connectMongoose = async () => {
    try {
        const connected = await mongoose.connect("mongodb://localhost:27017/populate", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log(`Connected Successfully at ${connected.connection.host}`);
    } catch (err) {
        console.error(":::::::::::::>" + err);
        process.exit(1);
    }
}
connectMongoose();

// The category schema contains the:
// name: a string that represent the caregory name
// product: a list of product that holds any product that can be in the category
// parent: a list of id that represents the tree of parent from the father to Adam. The parent also ref to the category schema so it can populate the parent with the actual data
// children: a list of id that represent all the children of a category. The children also ref to the category schema so it can populate the children with the actual data
const categorySchema = new mongoose.Schema({
    name: String,
    product: [String],
    parents: [{type: mongoose.Schema.Types.ObjectId, ref: "Category"}],
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category"}]
});

module.exports = new mongoose.model("Category", categorySchema);