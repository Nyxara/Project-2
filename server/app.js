const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/Project2';

// setup mongoose options to use newer functionality
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => { // connects to database
  if (err) {
    console.log('Could not connect to database');
  }
});

let redisURL = {
  // Use endpoint minus the number after the colon at the end
  hostname: 'redis-17712.c245.us-east-1-3.ec2.cloud.redislabs.com',
  // Put number after colon here
  port: '17712',
};

let redisPASS = 'UfvjQGM4anhMZcgINRvRCBurhyoJduSw';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  // may need to change below to redisPASS instead
  [, redisPASS] = redisURL.auth.split(':');
}
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// Pull in our routes
const router = require('./router.js');


const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/dnd.jpg`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// csrf must come AFTER app.use(cookieParser());
// & app.use(session({ . . . }) );
// but still be before router(app);
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
