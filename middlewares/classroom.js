const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = require('../secret');

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

async function getAccessToken(code) {
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  console.log('tokens: ', tokens); // WE GOT THE TOKENS YEEEEEEEET
}

module.exports = {
  url,
  getAccessToken
};