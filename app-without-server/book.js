class Book {
    constructor(id, title, genre, author, publishhouse, language, year) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.publishhouse = publishhouse;
        this.language = language;
        this.year = year;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getGenre() {
        return this.genre;
    }

    getAuthor() {
        return this.author;
    }

    getPHouse() {
        return this.publishhouse;
    }

    getLang() {
        return this.language;
    }

    getYear() {
        return this.year;
    }

}
// Для того чтобы я мог обратится к этому классу с других файлов
module.exports = Book;