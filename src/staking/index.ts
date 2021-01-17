import "../utils/env"
import * as global from "../global"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

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

export const getTotalStakeByType = async (role: Number):Promise<any> => {

  // https://github.com/onflow/flow-core-contracts/blob/301206b27090fa9116c1aba35cd8bade8a26857c/contracts/FlowIDTableStaking.cdc#L101
  // 
  // 1 = collection
  // 2 = consensus
  // 3 = execution
  // 4 = verification
  // 5 = access

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(role: UInt8): UFix64 {
            let staked = FlowIDTableStaking.getTotalTokensStakedByNodeType()
        
            return staked[role]!
          }`,
          fcl.args([
            fcl.arg(role, t.UInt8), 
          ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getTable = async ():Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(): [String] {
            return FlowIDTableStaking.getNodeIDs()
        }`,
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getStakeRequirements = async (role: Number):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(role: UInt8): UFix64 {
            let req = FlowIDTableStaking.getMinimumStakeRequirements()
        
            return req[role]!
        }`,
        fcl.args([
          fcl.arg(role, t.UInt8), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getProposedTable = async ():Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(): [String] {
            return FlowIDTableStaking.getProposedNodeIDs()
        }`,
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeUnstakingTokens = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.tokensUnstaking
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeUnstakingRequest = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.tokensRequestedToUnstake
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeUnstakedTokens = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.tokensUnstaked
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeTypeRatio = async (role:Number):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(role: UInt8): UFix64 {
            let ratios = FlowIDTableStaking.getRewardRatios()
        
            return ratios[role]!
        }`,
        fcl.args([
          fcl.arg(role, t.UInt8), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeCommittedBalanceWithoutDelegators = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            return FlowIDTableStaking.getNodeCommittedBalanceWithoutDelegators(nodeID)
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}


export const getNodeTotalCommitment = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            return FlowIDTableStaking.getNodeCommittedBalanceWithDelegators(nodeID)
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeStakingKey = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): String {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.stakingKey
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeStakedTokens = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.tokensStaked
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeRole = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UInt8 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.role
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}

export const getNodeRewardedTokens = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): UFix64 {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.tokensRewarded
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}


export const getNodeNetworkingKey = async (nodeID:String):Promise<any> => {

  fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
  try{
    return new Promise(function(resolve, reject) {
      fcl.send([
          fcl.script`
          import FlowIDTableStaking from ${global.contracts.StakingTable}
          pub fun main(nodeID: String): String {
            let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)
            return nodeInfo.networkingKey
        }`,
        fcl.args([
          fcl.arg(nodeID, t.String), 
        ])
        ])
          .then(response => fcl.decode(response), e => console.log(e))
          .then(nodes => {resolve(nodes)}, e => console.log(e))
      })
  }
  catch (e){
      console.log(e)
  }
}