const { Schema, model } = require('mongoose');

const ShortUrlSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  urlCode: String,
  hits: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = ShortUrl = model('Url', ShortUrlSchema);
