const Query = {
    user: (parent, {id}, {prisma}, info) =>{
        if(!id){//si no tienen id
            //buscar todos los usuarios con prisma
            return prisma.users.findMany();
        }

        //buscar usuario por id
        return prisma.users.findOne({
            where: { id }
        });
    },
    author: (parent, {id}, {prisma}, info) =>{
        if(!id){
            //buscar todos los autores
            return prisma.authors.findMany();
        }

        //buscar author por id
        return prisma.authors.findOne({
            where: { id }
        });
    },
    book: (parent, {id}, {prisma}, info) =>{
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