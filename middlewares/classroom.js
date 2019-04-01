const { google } = require('googleapis');

const CLIENT_ID = '492333572978-bc8ec5tuo2ohomn0fts3rsh2f634hm57.apps.googleusercontent.com',
      CLIENT_SECRET = 'x7hOvT1oz8gm3rCrkCGGAOaY',
      REDIRECT_URL = 'http://localhost:3000/home';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.announcements.readonly'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

module.exports.url = url;