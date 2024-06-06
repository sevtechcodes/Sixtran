import { ApolloServer, gql } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    fivetran_api_key: String!
    fivetran_api_secret: String!
    connectors: [Connector]!
  }

  type Connector {
    id: ID!
    name: String!
    userId: ID!
    user: User!
    type: String!
  }

  type Query {
    users: [User]!

    userById(id: ID!): User!

    userByEmail(email: String!): User!

    connectors: [Connector]!

    connectorsByUser(userId: ID!): [Connector]!
  }

  type Mutation {
    createUser(email: String!, fivetran_api_key: String!, fivetran_api_secret: String!): User!

    createConnector(userId: ID!, name: String!, type: String!): Connector!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: { connectors: true },
      });
    },

    userById: async (_, { id }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: { connectors: true },
      });
    },

    userByEmail: async (_, { email }) => {
      return await prisma.user.findUnique({
        where: { email },
        include: { connectors: true },
      });
    },

    connectors: async () => {
      return await prisma.connector.findMany({
        include: { user: true },
      });
    },

    connectorsByUser: async (_, { userId }) => {
      return await prisma.connector.findMany({
        where: { userId },
      });
    },
  },

  Mutation: {
    createUser: async (_, { email, fivetran_api_key, fivetran_api_secret }) => {
      return await prisma.user.create({
        data: {
          email,
          fivetran_api_key,
          fivetran_api_secret,
        },
      });
    },

    createConnector: async (_, { userId, name, type }) => {
      return await prisma.connector.create({
        data: {
          name,
          type,
          user: {
            connect: {
              id: userId,
            }
          }
        },
      });
    },
  },

  User: {
    connectors: async (parent) => {
      return await prisma.connector.findMany({
        where: { userId: parent.id },
      });
    },
  },

  Connector: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
