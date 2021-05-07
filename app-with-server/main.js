//Модуль net
const net = require('net');
// Функция логирования
const logging = require('./logging');
// Настройка подключения клиента
const client = net.connect(20202, 'localhost', () => {
    console.log('Connected to server!');

    // Подключение модуля fs для работы с файлами
    const fs = require('fs');
    // Подключение модуля zlib для сжатия и декмопрессии данных
    const zlib = require('zlib');
    // Импорт класса Book
    const Book = require('./book');
    // Импорт БД
    const books_db = require('./db/books_db.json');
    // Библиотека для упрощённой манипуляции в консоли
    const readlineSync = require('readline-sync');
    // Копирование БД в массив
    let books_array = books_db;
    // Массив для всех ID книг, используется для вычисления наибольшего числа (ID), который затем присоится новой книге в случае если мы будем добавлять
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


    logging("[CLIENT]\nЗапуск програми");
    // Определяем переменную в которой потом будем хранить разные вопросы
    let userRes;

    // Запускаем цикл пунктов меню
    while (true) {
        // Формируем главное меню
        console.log(`--------------------\n[1] Додати нову книгу\n[2] Видалити книгу\n[3] Вивести список книг (${books_array.length})\n[4] Знайти книгу\n[5] Зберегти поточний стан БД\n[6] Відновити збережену версію БД\n[0] Вийти\n--------------------`);
        userRes = readlineSync.question("> Виберіть пункт: "); // Пользователь вводит число, а далее всё идёт по условиям
        if (userRes === '1') {
            console.log(">>>>>>>>> [1] Додати нову книгу <<<<<<<<<");

            // Создаём новый объект книги, который будем дополнять свойствами после ответов юзера на вопросы
            let newBook = {
                id: check_book_id() + 1 // Проверяем наибольший найденный ID книги в массиве, получаем его и прибавляем 1 чтобы ID отличался от остальных
            };

            // Пользователь вводит название книги
            let enter_title = readlineSync.question("> Введіть назву книги: ");
            // Добваляем название книги к объекту
            newBook.title = enter_title;
            // Выводим пользователю то, что он ввёлі
            console.log(`-> ${newBook.title}`);

            // По тому же принципу, что и выше заполняем остальные данные книги
            let enter_genre = readlineSync.question("> Введіть жанр книги: ");
            newBook.genre = enter_genre;
            console.log(`-> ${newBook.genre}`);

            let enter_author = readlineSync.question("> Введіть автора книги: ");
            newBook.author = enter_author;
            console.log(`-> ${newBook.author}`);

            let enter_publishhouse = readlineSync.question("> Введіть видавництво: ");
            newBook.publishhouse = enter_publishhouse;
            console.log(`-> ${newBook.publishhouse}`);

            let enter_language = readlineSync.question("> Введіть мову: ");
            newBook.language = enter_language;
            console.log(`-> ${newBook.language}`);

            let enter_year = readlineSync.question("> Введіть рік: ");
            newBook.year = enter_year;
            console.log(`-> ${newBook.year}`);

            console.log("Нова книга успішно додана!");
            logging(`Додана нова книга:\n--\nID: ${newBook.id}\nTitle: ${newBook.title}\nGenre: ${newBook.genre}\nAuthor: ${newBook.author}\nPublish house: ${newBook.publishhouse}\nLanguage: ${newBook.language}\nYear: ${newBook.year}\n--`);

            // Добавляем в массив книг новую книгу сделанную по классу Book
            books_array.push(new Book(newBook.id, newBook.title, newBook.genre, newBook.author, newBook.publishhouse, newBook.language, newBook.year));
            // Записываем наш новый массив книг в БД попутно превращая объект в строку
            fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));

        } else if (userRes === '2') {
            console.log(">>>>>>>>> [2] Видалити книгу <<<<<<<<<");
            // Перебираем книги [ID - Название]      
            books_array.forEach(book => {
                console.log(`${book.id} - ${book.title}`);
            });
            // Спрашиваем какую книгу удалить по ID
            let enter_id = readlineSync.question("\n> Введіть номер книги (ID) для видалення: ");
            // Перебираем массив книг
            books_array.forEach(book => {
                // Если ID книги совпадает с вводом пользователя
                if (book.id == enter_id) {
                    console.log(`> ${book.title} - видалена з бази даних!`);
                    logging(`${book.title} - видалена з бази даних`);
                    // Удаляем из массива книгу
                    books_array.splice(books_array.indexOf(book), 1);
                    // Записываем результат в БД
                    fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));
                }
            });

        } else if (userRes === '3') {
            console.log(">>>>>>>>> [3] Вивести список книг <<<<<<<<<");
            // Выводим информацию о каждой книге в библиотеке
            books_array.forEach(book => {
                console.log(`[ID: ${book.id}]------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
            });
            logging("Список книг переглянуто");

        } else if (userRes === '4') {
            console.log(">>>>>>>>> [4] Знайти книгу <<<<<<<<<");
            // Спрашиваем какую книгу удалить по ID
            let search = readlineSync.question("\n> Введіть ID або назву книги: ");
            // Определяем содержит ли строка вначале только символы от 0 до 9 
            if (/^[0-9]/.test(search)) {
                // Если да, то мы ищем книгу по ID
                books_array.forEach(book => {
                    // Сравниваем ID книги и приведённый к числу ответ юзера, т.к. его ответ приходит в виде строки
                    if (book.id == +search) {
                        console.log(`------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
                        logging(`Виконаний пошук книги по ID, знайдена книга [ ${book.title} ]`);
                    }
                });
            } else if (/^[a-zA-Z ]/.test(search)) {
                // Проверяем содержит ли строка вначале только символы от а до z и от A до Z включая пробелы 
                books_array.forEach(book => {
                    // Проверяем совпадает ли введёный юзером ответ с тем что написано полностью или частично в book.title, при этом приводим всё к LowrCase для более лёгкого сравнения 
                    if (book.title.toLowerCase().indexOf(search.toLowerCase()) != -1) {
                        console.log(`------- ${book.title} -------\nAuthor: ${book.author},\nPublishHouse: ${book.publishhouse},\nLanguage: ${book.language},\nYear: ${book.year}\n`);
                        logging(`Виконаний пошук книги по назві, знайдена книга [ ${book.title} ]`);
                    }
                });
            } else {
                // Если не нашли совпадений то отвечаем что нет такой книги
                console.log("Вашої книги немає в базі даних");
                logging("Виконаний пошук книги, книга не знайдена");
            }

        } else if (userRes === '5') {
            console.log(">>>>>>>>> [5] Зберегти поточний образ БД <<<<<<<<<");
            let currentDB = JSON.stringify(books_array);
            // Создание архива
            let gzip = zlib.createGzip();
            fs.writeFileSync('db_copy/saved_db.json', currentDB);
            // Стрим для чтения данных текущей бд
            let inputFile = fs.createReadStream('db_copy/saved_db.json');
            // Стрим для записи данных в архив
            let outputFile = fs.createWriteStream('db_copy/saved_db.json.gz');
            // Архивация и запись текущего состояния бд
            inputFile.pipe(gzip).pipe(outputFile);
            console.log("Дані успішно збережені");
            logging("Збережений новий образ бази даних");

        } else if (userRes === '6') {
            console.log(">>>>>>>>> [6] Відновити збережену версію БД <<<<<<<<<");
            books_array = JSON.parse(fs.readFileSync("db_copy/saved_db.json"));
            fs.writeFileSync("db/books_db.json", JSON.stringify(books_array));
            console.log("Дані успішно відновлені");
            logging("Попередній образ бази даних був відновлений");
        } else if (userRes === '0') {
            // Если пользователь отвечает 0, то выходим из цикла и завершаем работу консольного приложения
            console.log("Вихід...");
            logging("[CLIENT]\nВихід із програми");
            client.end();
            return;
        }
    }
});

// Ловим ошибки
client.on('error', function (ex) {
    console.log("\n[ ----------- Не удалось подключится к серверу ----------- ]\n");
    console.log(ex);
    console.log("\n[ ----------- Не удалось подключится к серверу ----------- ]\n");
});

// Когда клиент отключился от сервера
client.on('end', function () {
    console.log('Отключён от сервера');
    logging('[CLIENT]\nОтключён от сервера');
});