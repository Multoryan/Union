// Подключаем и испльзуем фреймворк для node - express
const express = require('express')
const app = express()

// Подключение модуля работы с базой данных MongoDB
const mongo = require('./models/connect.js');

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


app.get('/', function (req, res) {
  res.send('Express работает')
})

app.get('/registration', function (req, res) {
  res.renderVue('registration',lang.registration);
})

// Парсинг форм из POST запросов
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/registration', function (req, res) {
  const email = req.body.email;
  // TODO: Проверка существует ли такой email в базе
  res.renderVue('registration',lang.registration);
})

app.get('/vue', function(req, res, next) {
  const data = {
    testmess: "Параметр с сервера"
  }
  res.renderVue('test', data)
})

app.listen(3000, function () {
  console.log('Сервер запущен на порту 3000!')
})
