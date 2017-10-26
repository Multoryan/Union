// Подключаем и испльзуем фреймворк для node - express
const express = require('express')
const app = express()

// Подключение модуля работы с базой данных MongoDB
const mongo = require('./models/connect.js');
const maindb = "mongodb://localhost:27017/union";

// Библиотка для усиления сложности
const bcrypt = require('bcryptjs');

// Поддержка Cookie файлов
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Шаблонизатор Vue
const expressVue = require('express-vue');
// Общедоступные ресурсы
app.use(express.static(__dirname + '/public'));
// Настройки Vue.js
const vueOptions = require('./config/vue.js').options;

// Загрузка файла с языком
// TODO: Добавить автоопределение на основе req.acceptsLanguages()
// TODO: Возможность изменять язык
const lang = require('./lang/ru');

// Использование Vue.js
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// Проверка авторизации пользователя
function isAuth(cook, callback){
  const cookies_try = {};
  cookies_try.hash = cook.changes;
  mongo.select(maindb, 'cookies', cookies_try, function(result){
    if(result.length)
        callback(result[0].userid.toString() === cook.userid);
    else
      callback(false);
  })
}

app.get('/org', function (req, res) {
  var path = require("path");
  res.sendFile(path.join(__dirname + '/public/test.html'));
})

app.get('/', function (req, res) {
  isAuth(req.cookies, function(result){
    if(result) res.renderVue('profile')
    else res.redirect('/auth');
  })
})

app.get('/change', function (req, res) {
  isAuth(req.cookies, function(result) {
    if(result) res.renderVue('password')
    else res.redirect('/auth');
  })
})

app.get('/registration', function (req, res) {
  isAuth(req.cookies, function(result){
    if(result) res.redirect('/')
    else res.renderVue('registration', lang.registration);
  });
})

// Парсинг форм из POST запросов
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/registration', function (req, res) {
  let user = {};
  user.email = req.body.email;
  mongo.select(maindb, 'users', user, function(result){
    if(result.length){
      // Пользователь с таким email существует
      res.send('duplicateEmail');
    }
    else{
      var generatePassword = require('password-generator');
      const password = generatePassword();
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      user.password = hash;
      // Учетная запись по умолчанию не активирована
      user.activate = false;
      // Дата регистрации
      user.time = Date.now();
      // Библиотека отправки Email
      const mailer = require('express-mailer');
      const emailOptions = require('./config/email.js').options;
      mailer.extend(app, emailOptions);
      // TODO: Отправлять письмо с паролем на email
      console.log(password);
      // Вносим пользователя в базу данных
      // TODO: Отладить работы с Email
      // TODO: Отредактировать шаблон
      // TODO: Попробовать отправлять письмо снова, если не дошло
      mongo.insert(maindb, 'users', user, function(result){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'pug');
        app.mailer.send('email/firstPassword', {
          to: user.email,
          subject: 'Регистрация в органайзере Union',
          password: password
        }, function (err) {
          if (err) {
            // handle error
            console.log(err);
            res.send('notSend');
            return;
          }
          res.send('good');
        });
      });
    }
  });
})

app.get('/auth', function(req, res) {
  isAuth(req.cookies, function(result){
    if(result) res.redirect('/')
    else res.renderVue('authorisation', lang.authorisation);
  })
})

app.post('/auth', function(req, res) {
  mongo.select(maindb, 'users', {email: req.body.email}, function(result){
    if(result.length){
      const hash = result[0].password;
      if(bcrypt.compareSync(req.body.password, hash)){

        // Пользователь прошел авторизацию
        let cookieuser = {};

        // Генерируем hash по которому будем проверять подлинность id
        var generatePassword = require('password-generator');
        const password = generatePassword();
        var salt = bcrypt.genSaltSync(10);
        var hash_cookie = bcrypt.hashSync(password, salt);

        cookieuser.userid = result[0]._id;
        cookieuser.live = new Date(Date.now() + 60*60*24*30*1000);
        cookieuser.hash = hash_cookie;
        // TODO: Активировать учетную запись пользователя
        mongo.insert(maindb, 'cookies', cookieuser, function(result){
          res.cookie('userid', cookieuser.userid, { expires: cookieuser.live, httpOnly: true });
          res.cookie('changes', cookieuser.hash, { expires: cookieuser.live, httpOnly: true });
          res.redirect('/');
        })
      }
      else res.send("wrongPass");
    }
    else res.send("notIsset");
  })

});

app.get("/exit", function (req, res) {
  // Удаляем из базы
  const cookie = {};
  cookie.userid = mongo.toId(req.cookies.userid);
  cookie.hash = req.cookies.changes;
  mongo.delete(maindb, 'cookies', cookie, function(result){
    if(result){
      res.clearCookie('userid');
      res.clearCookie('changes');
      res.send('exit');
    }
    else{
      res.send('notexit');
    }
  })
})

app.listen(3000, function () {
  console.log('Сервер запущен на порту 3000!')
})
