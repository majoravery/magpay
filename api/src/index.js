const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session'); // FOR THE SAFETY OF OUR TOKENS
const destroyer = require('server-destroy');
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const http = require('http');
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('cookie-session')
const url = require('url');

// let crypto;
// try {
//   crypto = require('crypto');
// } catch (err) {
//   console.log('crypto support is disabled!');
// }

require('dotenv').config();

const app = express();
const expiryDate = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // One week
const scopes = ['https://mail.google.com/'];

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

let windowObjectReference;
let refreshToken;
let accessToken;

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['not quite sure what i should put in here', 'will this work'],
  cookie: {
    secure: true,
    httpOnly: true,
    expires: expiryDate
  }
}))
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // Update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', true); // To allow FE to fetch with credentials
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function storeTokens(tokens, response) {
  if (tokens.refresh_token) {
    refreshToken = tokens.refresh_token;
    response.cookie('magbelle_rt', refreshToken, { maxAge: 604800, httpOnly: true }) // One week
  }
  accessToken = tokens.access_token;
  response.cookie('magbelle_at', accessToken, { maxAge: 604800, httpOnly: true }); // One week
}

// Routes

app.get('/', (request, response, next) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.get('/login', (request, response) => {
  const auth = new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });

    response.redirect(authorizeUrl);
  })
});

app.get('/oauthcallback', async (request, response) => {
  const { code } = request.query;
  if (!code) {
    response.json({ 'you_dun': 'it wrong' })
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  if (tokens.refresh_token) {
    refreshToken = tokens.refresh_token;
  }
  accessToken = tokens.access_token;

  response
    .cookie('magbelle_rt', refreshToken, { maxAge: 604800, httpOnly: true }) // One week
    .cookie('magbelle_at', accessToken, { maxAge: 604800, httpOnly: true }) // One week
    .cookie('magbelle_logged_in', 1, { domain: process.env.FRONTEND_DOMAIN, maxAge: 604800 }) // One week
    .json({ hello: 'world' });
    // .redirect(process.env.FRONTEND_URL);
});

app.post('/email', async (request, response) => {
  const { cookies } = request;
  const { magbelle_rt: refreshToken, magbelle_at: accessToken } = cookies;

  if (!refreshToken || !accessToken) {
    response.json({ 'something': 'is wrong' }).end();
  }

  // console.log({ refreshToken, accessToken });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_SENDER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
      accessToken,
    }
  });

  const { dataUri, state } = request.body;
  const { nameOfEmployee, salaryPeriod } = state;

  const message = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECIPIENT,
    subject: `Payslip for ${nameOfEmployee} - ${salaryPeriod}`,
    text: `Payslip for ${nameOfEmployee} - ${salaryPeriod}`,
    html: `<p>Payslip for ${nameOfEmployee} - ${salaryPeriod}</p>`,
    attachments: {
      filename: 'Payslip.pdf',
      path: dataUri,
    }
  };

  transporter.sendMail(message)
    .then(res => response.json({ res }))
    .catch(console.error);
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`)
});

