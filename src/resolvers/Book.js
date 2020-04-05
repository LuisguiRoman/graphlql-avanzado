const Book = {
    writted_by: (parent, args, {prisma}, info) =>{
        //buscar el libro por id y retornar el autor
        return prisma.books.findOne({
            where: { id: parent.id }
        }).authors();
    },
    register_by: (parent, args, {prisma}, info) =>{
        //buscar el libro por id y retornar el usuario que lo creo
        return prisma.books.findOne({
            where: { id: parent.id }
        }).users();
    }
}

export default Book;