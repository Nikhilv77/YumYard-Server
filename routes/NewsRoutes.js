const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); 

const getNews = router.post('/getNews', async (req, res) => {
  console.log("logged from news");
  try {
    const apiKey = req.body.apiKey; 
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
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
