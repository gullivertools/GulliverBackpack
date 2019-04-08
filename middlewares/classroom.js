const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = require('../secret');

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
// const scopes = [
//   'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
//   'https://www.googleapis.com/auth/classroom.announcements.readonly'
// ];

const scopes = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
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
  return tokens;
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function listCourses() {
  const classIDs = [];
  const classroom = google.classroom({version: 'v1', auth: oauth2Client});  // , auth
  classroom.courses.list({
    pageSize: 20,
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const courses = res.data.courses;
    console.log('----------------------------------------------');
    if (courses && courses.length) {
      courses.forEach(c => {
        classIDs.push(c);
      });
      console.log('Courses:', courses);
    } else {
      console.log('No courses found.');
    }
  });

  for(id in classIDs) {
    console.log(classroom.courses.courseWork.get({courseId: id, id: ''}));
  }
  
}

module.exports = {
  url,
  getAccessToken,
  listCourses
};