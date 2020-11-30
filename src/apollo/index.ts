import { ApolloServer, gql } from "apollo-server"
import { GraphQLJSONObject } from 'graphql-type-json'
import { GetAccount } from "../accounts/accounts"

export const startApolloServer = () => {
  const typeDefs = gql`
 
    scalar JSONObject

    type Account {
        address: String
        balance: Float
        code: String
        keysList: [JSONObject]
    }
    
    type Query {
        account(address: String!): Account
    }
  `
  
  const resolvers = {
      Query: {
        account: async (parent, args, context, info) => {
          return await GetAccount(args.address)
        },
      },
  }
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
  })
}
