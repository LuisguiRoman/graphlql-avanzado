import { GraphQLServer } from 'graphql-yoga';

//db dummy
import db from './db';

//queries
import Query from './resolvers/Query';
import Author from './resolvers/Author';
import Book from './resolvers/Book';

const context = { db };

const resolvers = {
    Query,
    Author,
    Book
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', 
    resolvers,
    context
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});