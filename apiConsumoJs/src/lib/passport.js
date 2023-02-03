const { session } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'nombre',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, nombre, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'bienvenido   ' + user.nombre));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    } 
  } else {
    return done(null, false, req.flash('message', 'Este usuardio no existe.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'nombre',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, nombre, password, done) => {
  const {grado,departamento,telefono,fechaNac} = req.body;
  console.log('a medias');
  const nuevoUsuario = {
    nombre,
    apellidos : 'caca',
    fechaNac,
    password,
    telefono,  
    departamento,
    grado
  };
  console.log(nuevoUsuario);
  nuevoUsuario.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO usuarios SET ? ', [nuevoUsuario]);
  nuevoUsuario.idUsuarios = result.insertId;
  return done(null, nuevoUsuario);
}));
passport.serializeUser((user, done) => { 
  console.log(user);
  done(null, user.idUsuarios);
});


passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]);
  done(null, rows[0]);
}); 