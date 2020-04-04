const Subscription = {
    count: {
        subscribe: (parent, args, {pubsub}, info) =>{
            let count = 0;

            setInterval(() =>{
                count++;
                //abrir un canal
                pubsub.publish('count', {
                    count
                });
            }, 1000);

            return pubsub.asyncIterator('count');
        }
    },
    author: {
        subscribe: (parent, args, {pubsub}, info) =>{
            //cada vez que alguien realice una mutacion
            //recibiran la info de este pull
            return pubsub.asyncIterator('author');
        }
    },
    book: {
        subscribe: (parent, {authorId}, {db, pubsub}, info) =>{
            return pubsub.asyncIterator(`book-${authorId}`);
        }
    }
};

export default Subscription;