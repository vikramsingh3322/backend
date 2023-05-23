const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;


const pexelsApiKey = process.env.PEXELS_API_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

app.get('/images', async (req, res, next) => {
  const { keyword, page } = req.query;

  try {
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&page=${page}&per_page=10&client_id=${unsplashAccessKey}`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
      }
    );
    const unsplashData = await unsplashResponse.json();

    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&page=${page}&per_page=10`,
      {
        headers: {
          Authorization: pexelsApiKey,
        },
      }
    );
    const pexelsData = await pexelsResponse.json();

    const combinedData = {
      source: 'Combined',
      data: [],
    };

    if (unsplashData) {
      combinedData.data = combinedData.data.concat(unsplashData.results.map((result) => ({
        id: result.id,
        name: getFirstThreeWords(result.alt_description),
        originalUrl: result.urls.regular,
        source: 'Unsplash',
      })));
    }

    if (pexelsData.total_results > 0) {
      combinedData.data = combinedData.data.concat(pexelsData.photos.map((photo) => ({
        id: photo.id,
        name: getFirstThreeWords(photo.photographer),
        originalUrl: photo.src.original,
        source: 'Pexels',
      })));
    }

    res.json(combinedData);

  } catch (error) {
    next(error);
  }
});

function getFirstThreeWords(text) {
  if (!text) {
    return '';
  }
  
  const words = text.trim().split(' ');
  return words.slice(0, 3).join(' ');
}

app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err); // Pass the error to the default error handler
  }

  // Set the response status code
  res.status(500);

  // Send a JSON response with an error message
  res.json({
    error: 'Something went wrong.',
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
