// Функция логирования действий пользователя
let logging = (msg) => {
    const fs = require('fs');
    //Запись времени операции
    let date = new Date();
    //
    let fileData = fs.readFileSync('log.txt', "utf-8");
    //Запись логов действий в файл
    fs.writeFileSync('log.txt', "--------- " + date + "  ---------\n" + msg + "\n\n" + fileData);
};
// Экспортировал функцию логирования чтобы не прописывать её заново во всех файлах
module.exports = logging;