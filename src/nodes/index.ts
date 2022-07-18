import "../utils/env"
import { Node } from "../entity/Node"
import { NodeInfo } from "../entity/NodeInfo"

export const getNodeInfos = () => {
    try {
        const nodeInfos = require(process.env.NODE_INFOS)
        for (const key in nodeInfos) {
            if (Object.prototype.hasOwnProperty.call(nodeInfos, key)) {
                const node:NodeInfo = nodeInfos[key];
                console.log(node)
                
                const nodeInfo = new Node()
                nodeInfo.nodeId = node.NodeID
                nodeInfo.address = node.Address
                nodeInfo.role = node.Role
                nodeInfo.stake = node.Weight
                nodeInfo.stakingPubKey = node.StakingPubKey
                nodeInfo.networkPubKey = node.NetworkPubKey

                Node.save(nodeInfo)
            }
        } 
    }
    catch (e){
        console.log("Getting node info: %o", e)
    }

}