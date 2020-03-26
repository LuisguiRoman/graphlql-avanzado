import { GraphQLServer } from 'graphql-yoga';

//queries
import Query from './resolvers/Query';

const resolvers = {
    Query
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', 
    resolvers
});

server.start(() => {
    console.log('Server is running on http://localhost:4000');
});