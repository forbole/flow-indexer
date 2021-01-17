import "../utils/env"
import * as global from "../global"
import * as fcl from "@onflow/fcl"

export const getStakedNodeIDs = async ():Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
    try{
      return new Promise(function(resolve, reject) {
        fcl.send([
            fcl.script`
            import FlowIDTableStaking from ${global.contracts.StakingTable}
            pub fun main(): {String: UFix64} {
              var nodes: {String: UFix64} = {}
              for nodeID in FlowIDTableStaking.getStakedNodeIDs() {
                nodes[nodeID] = FlowIDTableStaking.getNodeCommittedBalanceWithDelegators(nodeID)
              }
              return nodes
            }`
          ])
            .then(response => fcl.decode(response), e => console.log(e))
            .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
    }
}

export const getTotalStake = async ():Promise<any> => {
  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(): UFix64 {
            let stakedTokens = FlowIDTableStaking.getTotalTokensStakedByNodeType()
        
            // calculate the total number of tokens staked
            var totalStaked: UFix64 = 0.0
            for nodeType in stakedTokens.keys {
                // Do not count access nodes
                if nodeType != UInt8(5) {
                    totalStaked = totalStaked + stakedTokens[nodeType]!
                }
            }
        
            return totalStaked
        }`
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}