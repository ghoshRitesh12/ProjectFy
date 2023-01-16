require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const PORT = process.env.PORT || 4000;

const compression = require('compression');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');

// routers
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const signoutRouter = require('./routes/signout');
const refreshTokenRouter = require('./routes/refreshToken');
const homeRouter = require('./routes/home');
const apiRouter = require('./api/apiRoute');
const profileSettingsRouter = require('./routes/settings');
const projectRouter = require('./routes/project');
const publicProjectRouter = require('./routes/publicProject');
const allProjectsRouter = require('./routes/projects');
const allLabelsRouter = require('./routes/labels');
const confirmEmailRouter = require('./routes/confirmEmail');

// middlewares
const userAuth = require('./middlewares/userAuth');

// for changing the views directory to look in 
app.set('views', path.join(__dirname,'.', 'views'));
app.set('view engine', 'ejs');

// built-in middlewares
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(express.static(path.resolve(__dirname, '..', 'frontend', 'public')));
app.use(express.urlencoded({ extended: false }));


(async () => {
  await connectDB(process.env.DATABASE_URI);

  app.use('/signup', signupRouter);
  app.use('/signin', signinRouter);
  app.use('/signout', signoutRouter);
  app.use('/confirmation', confirmEmailRouter);
  app.use('/refresh', refreshTokenRouter);
  app.use('/public', publicProjectRouter);
  app.get('/inactive', (_, res) => res.sendStatus(200));
  app.use(userAuth);
  app.use('/', homeRouter);
  app.use('/profile-settings', profileSettingsRouter);
  app.use('/project', projectRouter);
  app.use('/projects', allProjectsRouter);
  app.use('/labels', allLabelsRouter);
  app.use('/api/v1', apiRouter);


  app.all('*', (req, res) => res.render('404'));

  app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));


  setInterval(() => { // don't sleep
    console.log('INTERVAL',new Date().toLocaleString());
    https.get('https://projectfy.cyclic.app/inactive');
  }, 420000);

})();

