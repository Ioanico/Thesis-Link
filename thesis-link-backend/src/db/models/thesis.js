const mongoose = require("mongoose");

const thesisSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        type: String,
        default: null,
    },
    student_upload: {
        type: String,
        default: null,
    },
    file: {
        type: String,
        default: null,
    },
    mentions: String,
    grade: Number,
});

const Thesis = mongoose.model("Thesis", thesisSchema, "theses");

module.exports = Thesis;
