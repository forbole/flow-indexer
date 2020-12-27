import "../utils/env"
import * as fcl from "@onflow/fcl"

const getStakedNodeIDs = async ():Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
    try{
      return new Promise(function(resolve, reject) {
        fcl.send([
            fcl.script`
            import FlowIDTableStaking from 0x8624b52f9ddcd04a
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

export {
  getStakedNodeIDs
}
