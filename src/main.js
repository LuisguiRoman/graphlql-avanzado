import { GraphQLServer, PubSub } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';

//db dummy
import db from './db';

//queries
import Query from './resolvers/Query';
import Author from './resolvers/Author';
import Book from './resolvers/Book';

//mutations
import Mutation from './resolvers/Mutation';

//subscription
import Subscription from './resolvers/subscription';


const prisma = new PrismaClient();

const pubsub = new PubSub();

const context = {
    db, pubsub, prisma
};

const resolvers = {
    Query,
    Author,
    Book,
    Mutation,
    Subscription
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', 
    resolvers,
    context: (request) =>{
        return {
            ...request,
            ...context
        }
    }
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});