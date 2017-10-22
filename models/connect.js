// Подключаем драйвер для работы с mongodb
const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
//mongo.insert('mongodb://localhost:27017/users', 'test2', [{email: "test@test.ru", password: "12345"}] );
//mongo.update('mongodb://localhost:27017/users', 'test2', {email: "test@test.ru"}, {$set: {password: "54321"}} );
//mongo.select('mongodb://localhost:27017/users', 'test', {});
//mongo.delete('mongodb://localhost:27017/users', 'test2', {password: '12345'});


// Вставка в базу данных
// url - адрес базы данных ex: 'mongodb://localhost:27017/users'
// collect - название коллекции ex: 'information'
// data - данные на вставку в формате массива объектов ex: [{id: 1, name: myname}]
// TODO: Должна возвращать количество вставленных элементов массива, или false в случае ошибки
exports.insert = (url, collect, data) => {
  // Подключаемся к базе данных
  MongoClient.connect(url, function(err, db) {
    // Проверяем успешно ли подключение
    assert.equal(null, err);
    let collection = db.collection(collect);
    collection.insertMany(data, function(err, result) {
      assert.equal(err, null);
      db.close();
    });
  });

}

// Обновление базы данных
// url - адрес базы данных ex: 'mongodb://localhost:27017/users'
// collect - название коллекции ex: 'information'
// where - выборка из базы в формате объекта: {id: 1}
// data - На что заменить в формате { $set: { changeid : 2 } }
// изменится могут оба поля
// TODO: Должна возвращать количество обновленных элементов или false в случае ошибки
exports.update = (url, collect, where, data) => {

  MongoClient.connect(url, function(err, db) {
    // Проверяем успешно ли подключение
    assert.equal(null, err);
    var collection = db.collection(collect);
    collection.updateOne(where, data, function(err, result) {
      assert.equal(err, null);
      db.close();
    });
  });
}

// Выборка из базы данных
// url - адрес базы данных ex: 'mongodb://localhost:27017/users'
// collect - название коллекции ex: 'information'
// where - выборка из базы в формате объекта: {id: 1}
exports.select = (url, collect, where) => {
  let documents = false;
  MongoClient.connect(url, function(err, db) {
    // Проверяем успешно ли подключение
    assert.equal(null, err);
    var collection = db.collection(collect);
    collection.find(where).toArray(function(err, docs) {
      assert.equal(err, null);
      console.dir(docs);
      documents = docs;
      db.close();
    });
  });
  return documents;
}

// Удаление из базы данных
// url - адрес базы данных ex: 'mongodb://localhost:27017/users'
// collect - название коллекции ex: 'information'
// where - выборка из базы в формате объекта: {id: 1}
exports.delete = (url, collect, where) => {
  let res = false;
  MongoClient.connect(url, function(err, db) {
    // Проверяем успешно ли подключение
    assert.equal(null, err);
    var collection = db.collection(collect);
    collection.deleteOne(where, function(err, result) {
      assert.equal(err, null);
      res = result;
      db.close();
    });
  });
  return res;
}