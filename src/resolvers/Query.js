import { getUserID } from '../utils';


const Query = {
    user: (_, {id}, { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        if(!id){//si no tienen id
            //buscar todos los usuarios con prisma
            return prisma.users.findMany();
        }

        //buscar usuario por id
        return prisma.users.findOne({
            where: { id }
        });
    },
    author: (_, {id}, { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        if(!id){
            //buscar todos los autores
            return prisma.authors.findMany();
        }

        //buscar author por id
        return prisma.authors.findOne({
            where: { id }
        });
    },
    book: (_, {id}, { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        if(!id){
            //buscar todos los libros
            return prisma.books.findMany();
        }

        //buscar libro por id
        return prisma.books.findOne({
            where: { id }
        });
    }
}

export default Query;