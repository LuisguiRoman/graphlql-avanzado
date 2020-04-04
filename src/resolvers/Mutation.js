import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    createUser: (parent, {data}, {db}, info) =>{
        const isEmailTaken = db.users.some(user => user.email === data.email);

        if(isEmailTaken){
            throw new Error('El email ya existe');
        }

        const user = {
            id: uuidv4(),
            ...data
        }

        db.users.push(user);

        return user;
    },
    updateUser: (parent, {id, ...data}, {db}, info) =>{
        const userExist  = db.users.find(user => user.id === id);
        const isEmailTaken = db.users.some(user => user.email === data.email);

        if(!userExist){
            throw new Error('User not found');
        }

        if(isEmailTaken){
            throw new Error('El email ya existe');
        }

        db.users = db.users.map(user =>{
            if(user.id === id){
                user = {...user, ...data};
                return user;
            }
            return user;
        });

        return {...userExist, ...data};
    },
    createAuthor: (parent, {data}, {db, pubsub}, info) =>{
        const author = {
            id: uuidv4(),
            ...data
        }

        db.authors.push(author);

        //canal y payload
        pubsub.publish('author', {
            author: {
                mutation: 'CREATED',
                data: author
            }
        });

        return author;
    },
    updateAuthor: (parent, {id, data}, {db, pubsub}, info) =>{
        const authorExist = db.authors.find(author => author.id === id);

        if(!authorExist){
            throw new Error('El autor no existe');
        }

        db.authors = db.authors.map(author =>{
            if(author.id === id){
                author = {...author, ...data};
                return author;
            }
            return author;
        });

        const authorUpdated = {...authorExist, ...data};

        //canal y payload
        pubsub.publish('author', {
            author: {
                mutation: 'UPDATED',
                data: authorUpdated
            }
        });

        return authorUpdated;
    },
    createBook: (parent, {data}, {db, pubsub}, info) =>{
        const isAuthorExist = db.authors.some(author => author.id === data.writted_by);

        if(!isAuthorExist){
            throw new Error('El author no existe');
        }

        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book);

        pubsub.publish(`book-${book.writted_by}`, {
            book: {
                mutation: 'CREATED',
                data: book
            }
        });

        return book;
    },
    updateBook: (parent, {id, data}, {db, pubsub}, info) =>{
        const bookExist = db.books.find(book => book.id === id);

        if(!bookExist){
            throw new Error('Libro no encontrado');
        }

        const authorExist = db.authors.some(author => author.id === data.writted_by);

        if(data.writted_by && !authorExist){
            throw new Error('El author no existe');
        }

        db.books = db.books.map(book =>{
            if(book.id === id){
                return book;
            }
            return book;
        });

        const bookUpdated = {...bookExist, ...data};

        pubsub.publish(`book-${bookUpdated.writted_by}`, {
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        });

        return bookUpdated;
    },
    deleteBook: (parent, {id}, {db, pubsub}, info) =>{
        const bookExist = db.books.find(book => book.id === id);

        if(!bookExist){
            throw new Error('Libro no encontrado');
        }

        db.books = db.books.reduce((acc, book) =>{
            //creamos un acumulador y lo iniciamos como un array vacio
            if(book.id !== id){
                acc.push(book);
            }

            return acc;
        }, []);

        pubsub.publish(`book-${bookExist.writted_by}`, {
            book: {
                mutation: 'DELETED',
                data: bookExist
            }
        });

        return bookExist;
    }
}

export default Mutation;