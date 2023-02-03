const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const morgan = require('morgan');
const pool = require('./database');
const exphbs = require('express-handlebars');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const http = require('http');
const rxjs = require('rxjs');
const bodyParser= require('body-parser');
const { dirname } = require('path');
const { database } = require('./keys');
var cookieParser = require('cookie-parser');


//inicializar
const app = express();
require('./lib/passport');


//setings 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    layout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs'); 
//middlewares



app.use(cookieParser());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'fsociety',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
  });
//rutas

app.use(require('./routes'));
app.use('/aplicacion',require('./routes/aplicacion'));
app.use('/authentication',require('./routes/authentication'));

//publico
app.use(express.static(path.join(__dirname,'public')));
//iniciar server
app.listen(app.get('port'),() =>{
    console.log('server on port', app.get('port'));
});



