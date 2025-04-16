import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar Upload
    type User {
        id: ID!
        name: String!
        email: String!
        role: String
        status: Boolean
        latitude: String
        longitude: String
        profilePic: String
        createdAt: String
    }
    type Query {
        getAllUsers: [User]
    }
     type Mutation {
        addUser(
            name: String!
            email: String!
            password: String
            role: String
            latitude: String
            longitude: String
            profilePic: String
        ): User
        uploadProfilePic(file: Upload!, email: String!): User
    }
`;