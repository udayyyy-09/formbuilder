const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Form" },
  description: { type: String, default: "" },
  headerImage: { type: String, default: "" },
  questions: [{
    type: { type: String, enum: ["categorize", "cloze", "comprehension"], required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    required: { type: Boolean, default: false },
    image: { type: String, default: "" },
    options: {
      categories: [String],
      items: [{
        text: String,
        category: String
      }],
      textWithBlanks: String,
      blanks: [String],
      passage: String,
      subQuestions: [{
        questionText: String,
        answerType: { type: String, enum: ["text", "mcq"] }
      }]
    }
  }]
}, { timestamps: true });
module.exports = mongoose.model('Form', FormSchema);