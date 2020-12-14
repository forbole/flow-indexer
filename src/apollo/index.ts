import { ApolloServer, gql } from "apollo-server"
import { GraphQLJSONObject } from 'graphql-type-json'
import { GetAccount, SDKGetAccount } from "../accounts/accounts"

export const startApolloServer = () => {
  const typeDefs = gql`
 
    scalar JSONObject

    type Account {
        address: String
        balance: Float
        code: String
        keysList: [JSONObject]
        contractsMap: [JSONObject]
    }
    
    type Query {
        account(address: String!): Account
        sdkAccount(address: String): Account
    }
  `
  
  const resolvers = {
      Query: {
        account: async (parent, args, context, info) => {
          return await GetAccount(args.address)
        },
        sdkAccount: async (parent, args, context, info) => {
          let acct = await SDKGetAccount(args.address)
          console.log(acct)
          return acct
        }
      },
  }
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
  })
}
