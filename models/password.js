// Проверка пароля на сложность
// возвращает значение от 0 до 5
// 0 - ошибка
// 1 - стандартный пароль
// 2 - очень простой
// 3 - простой
// 4 - сложный
// 5 - очень сложный

exports.difficult = (testpass) => {
  const bad = require('badpassword.js').password;
  const regUpper = /[A-Z]/ig/;
  const regLower = /[a-z]/ig/;
  const regNumber = /\d/g/;
  const regSymbol = /\W/g/;
  let difficult = 0;
  
  if ( testpass.match(regUpper) )
    ++difficult
  if ( testpass.match(regLower) )
    ++difficult
  if ( testpass.match(regNumber) )
    ++difficult
  if ( testpass.match(regSymbol) )
    ++difficult
  return difficult;
}
