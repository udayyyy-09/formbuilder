const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Form" },
  headerImage: { type: String, default: "" },
  questions: [{
    type: { type: String, enum: ["categorize", "cloze", "comprehension"], required: true },
    questionText: { type: String, required: true },
    image: { type: String, default: "" }, // Question image URL

    // Categorize-specific fields
    categories: { type: [String], default: [] },
    items: [{
      text: { type: String, required: true },
      category: { type: String, required: true }
    }],

    // Cloze-specific fields
    textWithBlanks: { type: String, default: "" },
    blanks: { type: [String], default: [] },

    // Comprehension-specific fields
    passage: { type: String, default: "" },
    subQuestions: [{
      questionText: { type: String, required: true },
      answerType: { type: String, enum: ["text", "mcq"], default: "text" }
    }]
  }]
});

module.exports = mongoose.model('Form', FormSchema);