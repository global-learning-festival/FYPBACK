const axios = require('axios');
const { response } = require('express');
const qs = require('querystring')
require('dotenv').config();

const Authorization = () => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`;
  return encodeURI(authUrl);
};  

const Redirect = async (code) => {
  try {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code,
    };

    const {data} = await axios({
      url:`https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`,
      method: 'Post',
      headers:{
        'Content-Type':'x-www-form-urlencoded'
      }
    }).then(response=>{
      return response;
    }).catch(error=>{
      return error;
    });

    return data
    
    /* Process the response as needed (e.g., save the access token)

    return { success: true, data: response.data };
    */
  } catch (error) {
    console.error('Error while exchanging code for access token:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  Authorization,  
  Redirect,
};
  