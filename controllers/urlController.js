const shortid = require('shortid');
const URL = require('../models/URL');

exports.createShortUrl = async (req, res) => {
    const { longUrl } = req.body;
  
    const urlCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;
      
    try {
      console.log('Creating short URL:', shortUrl);
  
      // Find the existing URL by longUrl
      let url = await URL.findOne({ longUrl });
      console.log('URL found:', url);
  
      if (url) {
        return res.json(url);
      }
  
      // Create a new URL if it does not exist
      url = new URL({ longUrl, shortUrl, urlCode });
      await url.save();
      res.send(url);
  
      
    } catch (err) {
      console.error('Error in creating short URL:', err);
      res.status(500).send('Server error');
    }
  };
  
exports.redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await URL.findOne({ urlCode: code });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getUrls = async (req, res) => {
  try {
    const urls = await URL.find();
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
