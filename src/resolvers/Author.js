import { getUserID } from '../utils';


const Author = {
    register_by: (parent, args,  { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        //buscar el autor por id 
        //y despues buscar el usuario que lo registro
        return prisma.authors.findOne({
            where: { id: parent.id }
        }).users();
    },
    books: (parent, args, { request, prisma }, info) =>{
        const userId = getUserID(request);//ejecutar middleware

        //buscar el libro por id 
        //y despues buscar quien es el escritor
        return prisma.authors.findOne({
            where: { id: parent.id }
        }).books();
    }
}

export default Author;