require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');

// routers
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const signoutRouter = require('./routes/signout');
const refreshTokenRouter = require('./routes/refreshToken');
const homeRouter = require('./routes/home');
const noteRouter = require('./routes/note');

// middlewares
const { userLogout } = require('./middlewares/userAuth');
const verifyJwt = require('./middlewares/verifyJwt');

// for changing the views directory to look in 
app.set('views', path.join(__dirname,'.', 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'frontend', 'public')));
app.use(express.urlencoded({ extended: false }));


(async () => {
  await connectDB(process.env.DATABASE_URI);

  app.use('/signup', signupRouter);
  app.use('/signin', signinRouter);
  app.use('/signout', signoutRouter);
  app.use('/refresh', refreshTokenRouter);
  app.use('/', homeRouter);
  app.use(userLogout);
  app.use(verifyJwt);
  app.use('/note', noteRouter);


  app.all('*', (req, res) => {
    res.render('404');
  })

  app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));

})();
