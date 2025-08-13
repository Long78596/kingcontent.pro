import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TIKTOK_CLIENT_ID = process.env.TIKTOK_CLIENT_ID;
const TIKTOK_SCOPE = process.env.TIKTOK_SCOPE;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

export const connectTikTokAccount = () => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_ID}&response_type=code&scope=${TIKTOK_SCOPE}&redirect_uri=${encodeURIComponent(
    TIKTOK_REDIRECT_URI
  )}`;
  window.location.href = authUrl;
};

export const TikTokCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await axios.post(
            'https://open-api.tiktok.com/oauth/access_token/',
            {
              client_key: TIKTOK_CLIENT_ID,
              client_secret: TIKTOK_CLIENT_SECRET,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: TIKTOK_REDIRECT_URI,
            }
          );

          const { access_token } = response.data.data;
          // Store the access token for future API requests
          localStorage.setItem('tiktok_access_token', access_token);
          console.log('Access Token:', access_token);
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      }
    };

    fetchAccessToken();
  }, [location]);

  return <div>Connecting to TikTok...</div>;
};
