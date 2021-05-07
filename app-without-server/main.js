// Подключил fs модуль для работы с файлами
const fs = require('fs');
// Подключил модуль zlib для сжатия и декмопрессии данных
const zlib = require('zlib');
// Импортировал класс Book чтобы лепить копии
const Book = require('./book');
// Импортировал БД
const books_db = require('./db/books_db.json');
// Библиотека для упрощённой манипуляции в консоли
const readlineSync = require('readline-sync');
// Скопировал БД в массив чтобы было удобно работать
let books_array = books_db;
// Массив для всех ID-шников книг, используется для вычисления наибольшего числа (ID), который затем присоится новой книге в случае если мы будем добавлять
let books_id = [];

// Функция вычисления наибольшего числа 
let check_book_id = () => {
    // Функция вычисления наибольшего числа для всех массивов ищет наибольшее число в массиве типа [1,2,3,4,5 ...] и возвращает наибольшее найденное
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };
    // Наполняем массив ID-шников
    books_array.forEach(book => {
        books_id.push(book.id);
    });
    // Возвращаем наибольшее найденое число в массиве ID-шников
    return books_id.max();
};

let logging = (msg) => {
    let date = new Date();
    let fileData = fs.readFileSync('log.txt', "utf-8");
    fs.writeFileSync('log.txt', "--------- " + date + "  ---------\n" + msg + "\n\n" + fileData);
};
logging("Запуск программы");
// Определяем переменную в которую потом будем вкидівать разніе вопросы
let userRes;

// Запускаем цикл пунктов меню
while (true) {
    // Формируем главное меню
    console.log(`--------------------\n[1] Добавить новую книгу\n[2] Удалить книгу\n[3] Посмотреть список книг (${books_array.length})\n[4] Найти книгу\n[5] Сохранить текущий образ БД\n[6] Восстановить сохранённую версию БД\n[0] Выйти\n--------------------`);
    userRes = readlineSync.question("> Выберите пункт: "); // Пользователь вводит число, а далее всё идёт по условиям
    if (userRes === '1') {
        console.log(">>>>>>>>> [1] Добавить новую книгу <<<<<<<<<");

        // Создаём новый объект книги, который будем дополнять свойствами после ответов юзера на вопросы
        let newBook = {
            id: check_book_id() + 1 // Проверяем наибольший найденный ID книги в массиве, получаем его и прибавляем 1 чтобы ID отличался от остальных
        };

        // Юзер вводит название книги
        let enter_title = readlineSync.question("> Введите название книги: ");
        // Добваляем название книги к объекту
        newBook.title = enter_title;
        // Выводим пользователю то, что он ввёл (к сожалению консоль только на английском пашет...)
        console.log(`-> ${newBook.title}`);

        // По той же схеме что и выше заполняем остальные данные книги
        let enter_genre = readlineSync.question("> Введите жанр книги: ");
        newBook.genre = enter_genre;
        console.log(`-> ${newBook.genre}`);

        let enter_author = readlineSync.question("> Введите автора книги: ");
        newBook.author = enter_author;
        console.log(`-> ${newBook.author}`);

        let enter_publishhouse = readlineSync.question("> Введите страну издательства: ");
        newBook.publishhouse = enter_publishhouse;
        console.log(`-> ${newBook.publishhouse}`);

        let enter_language = readlineSync.question("> Введите язык: ");
        newBook.language = enter_language;
        console.log(`-> ${newBook.language}`);

        let enter_year = readlineSync.question("> Введите год: ");
        newBook.year = enter_year;
        console.log(`-> ${newBook.year}`);

        // По желанию можно добавить проверки что юзер вводит в консоль, ну а пока представим что он идеальный и всё введёт верно =)
        console.log("Новая книга успешно добавлена!");
        logging(`Добавлена новая книга:\n--\nID: ${newBook.id}\nTitle: ${newBook.title}\nGenre: ${newBook.genre}\nAuthor: ${newBook.author}\nPublish house: ${newBook.publishhouse}\nLanguage: ${newBook.language}\nYear: ${newBook.year}\n--`);
              
        // Добавляем в массив книг новую книгу сделанную по классу Book
        books_array.push(new Book(newBook.id, newBook.title, newBook.genre, newBook.author, newBook.publishhouse, newBook.language, newBook.year));
        // Записываем наш новый массив книг в БД попутно превращая объект в строку
        fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));
    } else if (userRes === '2') {
        console.log(">>>>>>>>> [2] Удалить книгу <<<<<<<<<");
        // Перебираем книги [ID - Название]      
        books_array.forEach(book => {
            console.log(`${book.id} - ${book.title}`);
        });
        // Спрашиваем какую книгу по айдишнику удалить
        let enter_id = readlineSync.question("\n> Введите номер книги (ID) для удаления: ");
        // Перебираем массив книг
        books_array.forEach(book => {
            // Если ID книги совпадает с вводом юзера
            if (book.id == enter_id) {
                console.log(`> ${book.title} - удалена из базы книг!`);
                logging(`${book.title} - удалена из базы данных`);
                // То мы удаляем из массива книгу
                books_array.splice(books_array.indexOf(book), 1);
                // И записываем результат в БД
                fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));
            }
        });

    } else if (userRes === '3') {
        console.log(">>>>>>>>> [3] Посмотреть список книг <<<<<<<<<");
        // Выводим красиво информацию о каждой книге в нашей "библиотеке"
        books_array.forEach(book => {
            console.log(`[ID: ${book.id}]------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
        });
        logging("Просмотрен список книг");
    } else if (userRes === '4') {
        console.log(">>>>>>>>> [4] Найти книгу <<<<<<<<<");
        // Спрашиваем какую книгу по айдишнику удалить
        let search = readlineSync.question("\n> Введите ID или название книги: ");
        // Определяем содержит ли строка вначале только символы от 0 до 9 
        if (/^[0-9]/.test(search)) {
            // Если да, то мы ищем по ID книгу
            books_array.forEach(book => {
                // Сравниваем ID книги и приведённый к числу ответ юзера, т.к. его ответ приходит в виде строки
                if (book.id == +search) {
                    console.log(`------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
                    logging(`Осуществлён поиск книги по ID, найдена книга [ ${book.title} ]`);
                }
            });
        } else if (/^[a-zA-Z ]/.test(search)) {
            // Проверяем содержит ли строка вначале только символы от а до z и от A до Z включая пробелы 
            books_array.forEach(book => {
                // Проверяем совпадает ли введёный юзером ответ с тем что написано полностью или частично в book.title, при этом приводим всё к LowrCase для более лёгкого сравнения 
                if (book.title.toLowerCase().indexOf(search.toLowerCase()) != -1) {
                    console.log(`------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
                    logging(`Осуществлён поиск книги по названию, найдена книга [ ${book.title} ]`);
                }
            });
        } else {
            // Если не нашли совпадений то отвечаем что нет такой книги
            console.log("Вашей книги нет в каталоге");
            logging("Осуществлён поиск книги, книга не найдена");
        }
    } else if (userRes === '5') {
        console.log(">>>>>>>>> [5] Сохранить текущий образ БД <<<<<<<<<");
        let currentDB = JSON.stringify(books_array);
        let gzip = zlib.createGzip();
        fs.writeFileSync('db_copy/current_db.json', currentDB);
        let inputFile = fs.createReadStream('db_copy/current_db.json');
        let outputFile = fs.createWriteStream('db_copy/current_db.json.gz');
        inputFile.pipe(gzip).pipe(outputFile);
        console.log("Данные успешно сохранены"); 
        logging("Сохранён новый образ базы данных");
    } else if (userRes === '6') {
        console.log(">>>>>>>>> [6] Восстановить сохранённую версию БД <<<<<<<<<");
        books_array = JSON.parse(fs.readFileSync("db_copy/current_db.json"));
        fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));
        console.log("Данные успешно восстановлены"); 
        logging("Предидущий образ базы данных был восстановлен");       
    } else if (userRes === '0') {
        // Если юзер отвечает 0, то выходим из цикла и завершаем работу консольного приложения
        console.log("Выход...");
        logging("Выход из программы");
        return;
    }
}