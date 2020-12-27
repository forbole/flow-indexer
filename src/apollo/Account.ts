import { gql } from "apollo-server"
import { GraphQLJSONObject } from 'graphql-type-json'

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
    }`

export {
    typeDefs
}