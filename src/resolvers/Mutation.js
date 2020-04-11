import { generateToken, hashPassword, validatePassword, getUserID } from '../utils';


const Mutation = {
    singUp: async (parent, {data}, {prisma}, info) =>{
        const password = await hashPassword(data.password);

        const user = await prisma.users.create({
            data: {
                ...data,
                password
            }
        });

        return {
            user,
            token: generateToken(user.id)
        }
    },
    login: async (_, { data }, { prisma }) =>{
        const user = await prisma.users.findOne({
            where: {
                email: data.email
            }
        });

        //Validar contraseñas
        const isValid = await validatePassword(data.password, user.password);

        if(!isValid){
            throw new Error('Contraseña incorrecta');
        }

        return {
            user,
            token: generateToken(user.id)
        }

    },
    updateUser: async (_, { id, data }, { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        const { password } = data;

        if(password){//hashear contraseña si se actualiza
            data.password = await hashPassword(data.password);
        }

        //busca por id y actualiza los datos
        return prisma.users.update({
            where: { id: Number(id) },
            data
        });
    },
    createAuthor: async (parent, {data}, { request, prisma, pubsub}, info) =>{
        const userId = getUserID(request);//ejecutar middleware
        
        const { register_by, ...rest } = data;

        //crear autor creando la relacion con el usuario que lo creo
        const newAuthor = await prisma.authors.create({
            data: {
                ...rest,
                users: {
                    connect: {
                        id: Number(register_by)
                    }
                }
            }
        });

        //canal y payload
        pubsub.publish('author', {
            author: {
                mutation: 'CREATED',
                data: newAuthor
            }
        });

        return newAuthor;
    },
    updateAuthor: async (parent, {id, data}, { request, prisma, pubsub }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        const { register_by, ...rest } = data;

        if(register_by){//si se esta cambiando el author
            rest.users = {
                connect: {
                    id: Number(register_by)
                }
            };
        }

        const authorUpdated = await prisma.authors.update({
            where:{
                id: Number(id)
            },
            data: { ...rest }
        });

        //canal y payload
        pubsub.publish('author', {
            author: {
                mutation: 'UPDATED',
                data: authorUpdated
            }
        });

        return authorUpdated;
    },
    createBook: async (parent, {data}, { request, prisma, pubsub }, info) =>{
        const userId = getUserID(request);//ejecutar middleware
        
        const { writted_by, register_by, ...rest } = data;

        //crear libro relacionando el escrityor y creador por id
        const newBook = await prisma.books.create({
            data: {
                ...rest,
                authors: {
                    connect: {
                        id: Number(writted_by)
                    }
                },
                users: {
                    connect: {
                        id: Number(register_by)
                    }
                }
            }
        });
        
        pubsub.publish(`book-${newBook.writted_by}`, {
            book: {
                mutation: 'CREATED',
                data: newBook
            }
        });

        return newBook;
    },
    updateBook: async (parent, {id, data}, { request, prisma, pubsub }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        const { writted_by, register_by, ...rest } = data;

        if(writted_by){//en caso de que se edite el autor
            rest.authors = {
                connect: { id: Number(writted_by) }
            }
        }
        if(register_by){//en caso de que se eudite el creador
            rest.users = {
                connect: { id: Number(register_by) }
            }
        }

        const bookUpdated = await prisma.books.update({
            where: {
                id: Number(id)
            },
            data: { ...rest }
        });

        pubsub.publish(`book-${bookUpdated.writted_by}`, {
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        });

        return bookUpdated;
    },
    deleteBook: async (parent, {id}, { request, prisma, pubsub }, info) =>{
        const userId = getUserID(request);//ejecutar middleware
        
        const bookDeleted = await prisma.books.delete({
            where: {
                id: Number(id)
            }
        });

        pubsub.publish(`book-${bookDeleted.writted_by}`, {
            book: {
                mutation: 'DELETED',
                data: bookDeleted
            }
        });

        return bookDeleted;
    }
}

export default Mutation;