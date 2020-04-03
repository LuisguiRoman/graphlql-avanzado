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
    createBook: (parent, {data}, {db}, info) =>{
        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book);

        return book;
    },
    updateBook: (parent, {id, data}, {db}, info) =>{
        const bookExist = db.books.find(book => book.id === id);

        if(!bookExist){
            throw new Error('Libro no encontrado');
        }

        db.books = db.books.map(book =>{
            if(book.id === id){
                return book;
            }
            return book;
        });

        return {...bookExist, ...data};
    },
    deleteBook: (parent, {id}, {db}, info) =>{
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

        return bookExist;
    }
}

export default Mutation;