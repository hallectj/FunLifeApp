const sharp = require('sharp');
const axios = require('axios');

async function convertToWebPBase64(inputImageUrl) {
  try {
    // Fetch the image from the original URL
    const imageBuffer = await fetchImage(inputImageUrl);

    // Convert the image to WebP format using Sharp
    const webpBuffer = await sharp(imageBuffer).toFormat('webp').toBuffer();

    // Convert the WebP buffer to a base64 string
    const webpBase64 = webpBuffer.toString('base64');

    return webpBase64;
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw error;
  }
}

async function batchConvertToWebPBase64(imageUrls) {
  try {
    const webpBase64Array = await Promise.all(imageUrls.map(convertToWebPBase64));
    return webpBase64Array;
  } catch (error) {
    console.error('Error batch converting images to WebP:', error);
    throw error;
  }
}

async function fetchImage(imageUrl) {
  try {
    // Fetch the image using Axios or another HTTP library
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Return the image buffer
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

module.exports = {
  convertToWebPBase64,
  batchConvertToWebPBase64
};