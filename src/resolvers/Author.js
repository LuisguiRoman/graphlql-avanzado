const Author = {
    register_by: (parent, args, {db}, info) =>{
        return db.users.find(user => user.id === parent.register_by);
    }
}

export default Author;