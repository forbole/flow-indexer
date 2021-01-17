import { ApolloServer, gql } from "apollo-server"
import { GraphQLJSONObject } from 'graphql-type-json'
import * as Account from "../accounts"
import * as Staking from '../staking'

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
        lockedAccountAddress(address: String!): String
        lockedAccountBalance(address: String!): Float
        unlockLimit(address: String!): Float
    }
  `
  
  const resolvers = {
      Query: {
        account: async (parent, args, context, info) => {
          return await Account.getAccount(args.address)
        },
        stakingNodes: async (parent, args, context, info) => {
          return {nodes:await Staking.getStakedNodeIDs()}
        },
        lockedAccountAddress: async (parent, args, context, info) => {
          return await Account.getLockedAccountAddress(args.address)
        },
        lockedAccountBalance: async (parent, args, context, info) => {
          return await Account.getLockedAccountBalance(args.address)
        },
        unlockLimit: async (parent, args, context, info) => {
          return await Account.getUnlockLimit(args.address)
        }
      },
  }
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
  })
}
