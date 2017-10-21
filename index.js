// Подключаем и испльзуем фреймворк для node - express
const express = require('express')
const app = express()
// Подключаем драйвер для работы с mongodb
const MongoClient = require("mongodb").MongoClient;
// Шаблонизатор Vue
const expressVue = require('express-vue');

const vueOptions = {
    rootPath: './views',
    layout: {
        start: '<div id="app">',
        end: '</div>'
    }
};

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);


app.get('/', function (req, res) {
  res.send('Express работает')
})

app.get('/vue', function(req, res, next) {
  const data = {
    testmess: "Параметр с сервера"
  }
  res.renderVue('test', data)
})

app.get('/mongo', function(req, res) {
  MongoClient.connect("mongodb://localhost:27017/users", function(err, db){
    if(err){
        res.send('Mongodb не запущена')
        return console.log(err);
    }
    else{
      res.send('Mongodb успешно запущена')
    }
    db.close();
  });
})

app.listen(3000, function () {
  console.log('Сервер запущен на порту 3000!')
})
