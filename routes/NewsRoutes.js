const axios = require('axios')
const express = require('express');
const router = express.Router();
const getNews = router.post('/getNews', async (req, res) => {
  console.log("logged from news");
  try {
    const apiKey = req.body.apiKey; 
    const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=food`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'News could not be fetched' });
  }
});

module.exports ={getNews};
