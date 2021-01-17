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
        delegatorID(address: String!): Int
        delegatorNodeID(address: String!): String
        delegatorNodeInfo(address: String!): JSONObject
        stakerNodeID(address: String!): String
        stakerNodeInfo(address: String!): JSONObject
        totalStake: Float
        totalStakeByType(role:Int!): Float
        stakingTable: [String]
        stakingRequirements(role:Int!): Float
        proposedTable: [String]
        nodeUnstakingTokens(nodeID: String!): Int
        nodeUnstakingRequest(nodeID: String!): Int
        nodeUnstakedTokens(nodeID: String!): Int
        nodeTypeRatio(role: Int!): Float
        nodeCommittedBalanceWithoutDelegators(nodeID: String!): Float
        nodeTotalCommitment(nodeID: String!): Float
        nodeStakingKey(nodeID: String!): String
        nodeStakedTokens(nodeID: String!): Float
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
        },
        delegatorID: async (parent, args, context, info) => {
          return await Account.getDelegatorID(args.address)
        },
        delegatorNodeID: async (parent, args, context, info) => {
          return await Account.getDelegatorNodeID(args.address)
        },
        delegatorNodeInfo: async (parent, args, context, info) => {
          return await Account.getDelegatorNodeInfo(args.address)
        },
        stakerNodeID: async (parent, args, context, info) => {
          return await Account.getStakerNodeID(args.address)
        },
        stakerNodeInfo: async (parent, args, context, info) => {
          return await Account.getStakerNodeInfo(args.address)
        },
        totalStake: async (parent, args, context, info) => {
          return await Staking.getTotalStake()
        },
        totalStakeByType: async (parent, args, context, info) => {
          return await Staking.getTotalStakeByType(args.role)
        },
        stakingTable: async (parent, args, context, info) => {
          return await Staking.getTable()
        },
        stakingRequirements: async (parent, args, context, info) => {
          return await Staking.getStakeRequirements(args.role)
        },
        proposedTable: async (parent, args, context, info) => {
          return await Staking.getProposedTable()
        },
        nodeUnstakingTokens: async (parent, args, context, info) => {
          return await Staking.getNodeUnstakingTokens(args.nodeID)
        },
        nodeUnstakingRequest: async (parent, args, context, info) => {
          return await Staking.getNodeUnstakingRequest(args.nodeID)
        },
        nodeUnstakedTokens: async (parent, args, context, info) => {
          return await Staking.getNodeUnstakedTokens(args.nodeID)
        },
        nodeTypeRatio: async (parent, args, context, info) => {
          return await Staking.getNodeTypeRatio(args.role)
        },
        nodeCommittedBalanceWithoutDelegators: async (parent, args, context, info) => {
          return await Staking.getNodeCommittedBalanceWithoutDelegators(args.nodeID)
        },
        nodeTotalCommitment: async (parent, args, context, info) => {
          return await Staking.getNodeTotalCommitment(args.nodeID)
        },
        nodeStakingKey: async (parent, args, context, info) => {
          return await Staking.getNodeStakingKey(args.nodeID)
        },
        nodeStakedTokens: async (parent, args, context, info) => {
          return await Staking.getNodeStakedTokens(args.nodeID)
        }


        
        

        
        

      },
  }
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
  })
}
