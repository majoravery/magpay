const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session'); // FOR THE SAFETY OF OUR TOKENS
const express = require('express');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const scopes = ['https://mail.google.com/', 'openid', 'email'];

const oauth2 = google.oauth2('v2');
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

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
    expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // One week
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
  // response.json({ info: 'Node.js, Express, and Postgres API' })
  response.redirect('/home');
});

app.get('/login', (request, response) => {
  if (request.session.isLoggedIn) {
    response.redirect('/home');
    return;
  }

  const auth = new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });

    response.redirect(authorizeUrl);
  })
});

app.get('/logout', (request, response) => {
  request.session = null;
  response
    .clearCookie('magbelle_rt')
    .clearCookie('magbelle_at')
    .redirect('/');
});

app.get('/oauthcallback', async (request, response) => {
  const { code } = request.query;
  if (!code) {
    response.json({ success: false, message: 'Missing authorisation token' }).end();
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  if (tokens.refresh_token) {
    refreshToken = tokens.refresh_token;
  }
  accessToken = tokens.access_token;

  request.session.isLoggedIn = true;

  const oauth2data = await oauth2.userinfo.get({ auth: oauth2Client });
  request.session.userinfo = oauth2data.data;

  response
    .cookie('magbelle_rt', refreshToken, { maxAge: 604800, httpOnly: true }) // One week
    .cookie('magbelle_at', accessToken, { maxAge: 604800, httpOnly: true }) // One week
    .redirect('/home');
});

app.get('/user', (request, response) => {
  response.json(request.session.userinfo).end();
})

// FIXME: try another method
app.get('/logincheck', (request, response) => {
  if (request.session.isLoggedIn) {
    response.status(200).send({ success: true });
  } else {
    response.status(401).send({ success: false });
  }
})

app.post('/email', async (request, response) => {
  const { cookies } = request;
  const { magbelle_rt: refreshToken, magbelle_at: accessToken } = cookies;

  if (!refreshToken || !accessToken) {
    response.json({
      success: false,
      message: 'Access token and refresh token missing.'
    }).end();
    return;
  }

  console.log({ refreshToken, accessToken });
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

  const { dataUri, recipient, subject, message } = request.body;

  const mail = {
    from: request.session.userinfo.email,
    to: recipient,
    subject,
    text: message,
    html: message,
    attachments: {
      filename: 'Payslip.pdf',
      path: dataUri,
    }
  };

  transporter.sendMail(mail, (err, info) => {
    console.log(err, info);
    let obj;
    if (err) {
      obj = {
        success: false,
        message: err.message,
      }
    } else {
      obj = {
        success: true,
      }
    }

    response.json(obj).end();
  })
});

app.listen(process.env.PORT || 8001, () => {
  console.log(`App running on port ${process.env.PORT}.`)
});

