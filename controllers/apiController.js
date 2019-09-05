const router = require('express').Router();
const ShortUrl = require('../models/ShortUrl');

const isEmpty = require('../utils/isEmpty');
const generateRandomString = require('../utils/generateRandomString');

// Access .env file values
require('dotenv').config();
const { BASE_URL } = process.env;

// @route   POST api/short
// @desc    Short a given URL
// @access  public
router.post('/short', (req, res, next) => {
  let shortUrl;
  if (isEmpty(req.body)) {
    return res
      .status(400)
      .json({ success: false, msg: 'Data missing!', data: req.body });
  }

  // Create a shorturl object
  shortUrl = new ShortUrl({
    url: req.body.url
  });

  createAndSaveShortUrl(shortUrl, res);
});

// @route   GET api/:id
// @desc    Redirect to actual url based on URL id
// @access  public
router.get('/:id', (req, res, next) => {
  const urlCode = req.params.id;

  ShortUrl.findOne({ urlCode: urlCode }, (err, urlObj) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: 'Internal Server Error!' });
    }

    if (isEmpty(urlObj)) {
      return res
        .status(404)
        .json({ success: false, msg: 'URL does not exist!' });
    }

    const redirectTo = urlObj.url;
    // Update the hits counter of url
    ShortUrl.updateOne(
      { urlCode: urlCode },
      { $inc: { hits: 1 } },
      (err, model) => {
        if (err) {
          console.log(err);
          return;
        }

        // Redirect to actual URL
        return res.redirect(redirectTo);
      }
    );
  });
});

function createAndSaveShortUrl(shortUlrObj, res) {
  // Generate a random string to replace the url
  let randomStr = generateRandomString();
  // Check if the random string already exist in DB
  ShortUrl.findOne({ urlCode: randomStr }, (err, url) => {
    if (err) {
      console.log(err);
    } else if (url == null || isEmpty(url)) {
      shortUlrObj.urlCode = randomStr;
      // Not a duplicate
      shortUlrObj.save(err => {
        if (err) {
          return res.status(400).json({ success: true, msg: err });
        }
        return res
          .status(200)
          .json({ success: true, url: BASE_URL + randomStr });
      });
    } else {
      // Generated random string already exist in the DB
      // Try once again
      saveShortUrl(shortUlrObj);
    }
  });
}

module.exports = router;
