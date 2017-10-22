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
const vueOptions = {
    rootPath: './views',
    layout: {
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        },
        template: {
            start: '<div id="app">',
            end: '</div>'
        }
    },
    vue: {
        head: {
            meta: [
                { script: "./js/vue.min.js" }
            ]
        }
    }
};

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
    if(result.length){
      if(result[0].userid.toString() === cook.userid)
        callback(true);
      else
        callback(false);
    }
    else
      callback(false);
  })
}

app.get('/', function (req, res) {
  //TODO: Нет доступа не авторизованным пользователям
  isAuth(req.cookies, function(result){
    if(result) res.send('Express работает')
    else res.redirect('/auth');
  })
})

app.get('/registration', function (req, res) {
  res.renderVue('registration',lang.registration);
})

// Парсинг форм из POST запросов
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/registration', function (req, res) {
  let user = {};
  user.email = req.body.email;
  // TODO: Функция должна ожидать пока выполнится
  mongo.select(maindb, 'users', user, function(result){
    if(result.length){
      // TODO: Отрендерить ошибку
      console.log('Пользователь с таким Email уже существует');
      res.renderVue('registration',lang.registration);
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
      // TODO: Отправлять письмо с паролем на email
      console.log(password);
      // Вносим пользователя в базу данных
      mongo.insert(maindb, 'users', user, function(result){
        console.log(result);
        res.redirect('/auth');
      });
    }
  });
})

app.get('/vue', function(req, res, next) {
  const data = {
    testmess: "Параметр с сервера"
  }
  res.renderVue('test', data)
})

app.get('/auth', function(req, res) {
  res.renderVue('authorisation', lang.authorisation);
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

        mongo.insert(maindb, 'cookies', cookieuser, function(result){
          res.cookie('userid', cookieuser.userid, { expires: cookieuser.live, httpOnly: true });
          res.cookie('changes', cookieuser.hash, { expires: cookieuser.live, httpOnly: true });
          res.redirect('/');
        })
      }else{
        //TODO: Отправлять сообщение клиенту
        console.log('Неверный пароль');
        res.renderVue('authorisation', lang.authorisation);
      }
    }
    else{
      //TODO: Отправлять сообщение пользователю
      console.log('Нет пользователя с таким Email')
      res.renderVue('authorisation', lang.authorisation);
    }
  })

});

app.listen(3000, function () {
  console.log('Сервер запущен на порту 3000!')
})
