// Подключили модуль net
const net = require('net');
// Импортировали функцию логирования
const logging = require('./logging');
// Создаём сервер
const server = net.createServer(function (socket) {
    // Если клиент подключился то мы выводим сообщение
    console.log('client connected');
    // и его данные
    console.dir(socket.address());
    logging(`[SERVER]\n--- Client connected ---\nAddres: ${socket.address().address}\nFamily: ${socket.address().family}\nPort: ${socket.address().port}`);

    socket.on('end', function () {
        console.log('client disconnected');
        logging(`[SERVER]\n--- Client disconnected ---\nAddres: ${socket.address().address}\nFamily: ${socket.address().family}\nPort: ${socket.address().port}`);
    });
    socket.pipe(socket);
});

server.listen(20202, function () {
    console.log('Server is online!');
    logging('[SERVER]\nServer is online!');
});
