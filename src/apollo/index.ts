import { ApolloServer, gql } from "apollo-server"
import { GraphQLJSONObject } from 'graphql-type-json'
import { getAccount, getLockedAccount } from "../accounts"
import { getStakedNodeIDs } from '../staking'

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

    type StakingNode {
        nodes: JSONObject
    }
    
    type Query {
        account(address: String!): Account
        stakingNodes: StakingNode
    }
  `
  
  const resolvers = {
      Query: {
        account: async (parent, args, context, info) => {
          return await getAccount(args.address)
        },
        stakingNodes: async (parent, args, context, info) => {
          return {nodes:await getStakedNodeIDs()}
        },
        getLockedAccount: async (parent, args, context, info) => {
          // return 
        }
      },
  }
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
  })
}
