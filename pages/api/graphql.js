// create user

// retrieve user credentials

// pages/api/graphql.js

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

    user_by_id(id: ID!): User!

    user_by_email(id: ID!): User!

    connectors: [Connector]!

    connectors_by_user(userId: ID!): [Connector]!
  }

`;

const resolvers = {
  Query: {
    user_by_id: async (_, { id }) => {
      return await prisma.user.findUnique({
        where: { id: id},
        include: { connectors: true },
      });
    },

    user_by_email: async (_, { email }) => {
      return await prisma.user.findUnique({
        where: { email: email},
        include: { connectors: true },
      });
    },

    connectors_by_user: async (_, { userId }) => {
      return await prisma.user.findMany({
        where: { userId: userId},
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
