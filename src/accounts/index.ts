import { AccessAPI, GetAccountRequest, GetAccountResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { addressBuffer } from "../utils/address"
import * as global from "../global"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"


export const getAccount = async (address: string):Promise<any> => {
    try{
        const req = new GetAccountRequest()
        console.log(addressBuffer(Buffer.from(address, 'base64').toString('hex')))
        req.setAddress(addressBuffer(Buffer.from(address, 'base64').toString('hex')))
        console.log("Get account address: %o", address)
        const res:GetAccountResponse = await unary(AccessAPI.GetAccount, req)
        return res.account
    }
    catch(e){
        console.log(e)
        return null
    }
}

export const getLockedAccountAddress = async (address: string):Promise<string> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                import LockedTokens from ${global.contracts.LockedTokens}
                pub fun main(account: Address): Address {

                    let lockedAccountInfoRef = getAccount(account)
                        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                        .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")

                    return lockedAccountInfoRef.getLockedAccountAddress()
                }`,
                fcl.args([
                    fcl.arg(address, t.Address), // a
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
          })
      }
      catch (e){
          console.log(e)
          return e
      }
}

export const getLockedAccountBalance = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import LockedTokens from ${global.contracts.LockedTokens}
                    pub fun main(account: Address): UFix64 {

                    let lockedAccountInfoRef = getAccount(account)
                        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                        .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")
                
                    return lockedAccountInfoRef.getLockedAccountBalance()
                }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
          })
      }
      catch (e){
          console.log(e)
          return e
      }
}

export const getUnlockLimit = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import LockedTokens from ${global.contracts.LockedTokens}
                    pub fun main(account: Address): UFix64 {

                    let lockedAccountInfoRef = getAccount(account)
                        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                        .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")
                
                    return lockedAccountInfoRef.getUnlockLimit()
                }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
          })
      }
      catch (e){
          console.log(e)
          return e
      }
}

export const getDelegatorID = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import LockedTokens from ${global.contracts.LockedTokens}
                    pub fun main(account: Address): UInt32 {

                        let lockedAccountInfoRef = getAccount(account)
                            .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                            .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")
                    
                        return lockedAccountInfoRef.getDelegatorID()!
                }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
        return e
    }
}

export const getDelegatorNodeID = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import LockedTokens from ${global.contracts.LockedTokens}
                    pub fun main(account: Address): String {

                        let lockedAccountInfoRef = getAccount(account)
                            .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                            .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")
                    
                        return lockedAccountInfoRef.getDelegatorNodeID()!
                    }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
        return e
    }
}

export const getDelegatorNodeInfo = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import FlowIDTableStaking from ${global.contracts.StakingTable}
                    import LockedTokens from ${global.contracts.LockedTokens}
                    // Returns an array of DelegatorInfo objects that the account controls
                    // in its normal account and shared account

                    pub fun main(account: Address): [FlowIDTableStaking.DelegatorInfo] {

                        let delegatorInfoArray: [FlowIDTableStaking.DelegatorInfo] = []

                        let pubAccount = getAccount(account)

                        let delegator = pubAccount.getCapability<&{FlowIDTableStaking.NodeDelegatorPublic}>(/public/flowStakingDelegator)!
                            .borrow()

                        if let delegatorRef = delegator {
                            delegatorInfoArray.append(FlowIDTableStaking.DelegatorInfo(nodeID: delegatorRef.nodeID, delegatorID: delegatorRef.id))
                        }

                        let lockedAccountInfoCap = pubAccount
                            .getCapability
                            <&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>
                            (LockedTokens.LockedAccountInfoPublicPath)

                        if lockedAccountInfoCap == nil || !(lockedAccountInfoCap!.check()) {
                            return delegatorInfoArray
                        }

                        let lockedAccountInfo = lockedAccountInfoCap!.borrow()

                        if let lockedAccountInfoRef = lockedAccountInfo {
                            let nodeID = lockedAccountInfoRef.getDelegatorNodeID()
                            let delegatorID = lockedAccountInfoRef.getDelegatorID()

                            if (nodeID == nil || delegatorID == nil) {
                                return delegatorInfoArray
                            }

                            delegatorInfoArray.append(FlowIDTableStaking.DelegatorInfo(nodeID: nodeID!, delegatorID: delegatorID!))
                        }

                        return delegatorInfoArray
                    }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
        return e
    }
}

export const getStakerNodeID = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                    import LockedTokens from ${global.contracts.LockedTokens}
                    pub fun main(account: Address): String {

                        let lockedAccountInfoRef = getAccount(account)
                            .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(LockedTokens.LockedAccountInfoPublicPath)!
                            .borrow() ?? panic("Could not borrow a reference to public LockedAccountInfo")
                    
                        return lockedAccountInfoRef.getNodeID()!
                    }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
        return e
    }
}

export const getStakerNodeInfo = async (address: string):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)

    try{
        return new Promise(function(resolve, reject) {
            fcl.send([
                fcl.script`
                import FlowIDTableStaking from ${global.contracts.StakingTable}
                import LockedTokens from ${global.contracts.LockedTokens}
                // Returns an array of NodeInfo objects that the account controls
                // in its normal account and shared account
                
                pub fun main(account: Address): [FlowIDTableStaking.NodeInfo] {
                
                    let nodeInfoArray: [FlowIDTableStaking.NodeInfo] = []
                
                    let pubAccount = getAccount(account)
                
                    let nodeStaker = pubAccount.getCapability<&{FlowIDTableStaking.NodeStakerPublic}>(FlowIDTableStaking.NodeStakerPublicPath)!
                        .borrow()
                
                    if let nodeRef = nodeStaker {
                        nodeInfoArray.append(FlowIDTableStaking.NodeInfo(nodeID: nodeRef.id))
                    }
                
                    let lockedAccountInfoCap = pubAccount
                        .getCapability
                        <&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>
                        (LockedTokens.LockedAccountInfoPublicPath)
                
                    if lockedAccountInfoCap == nil || !(lockedAccountInfoCap!.check()) {
                        return nodeInfoArray
                    }
                
                    if let lockedAccountInfoRef = lockedAccountInfoCap!.borrow() {
                    
                        if (lockedAccountInfoRef.getNodeID() == nil) {
                            return nodeInfoArray
                        }
                
                        nodeInfoArray.append(FlowIDTableStaking.NodeInfo(nodeID: lockedAccountInfoRef.getNodeID()!))
                    }
                    
                    log(nodeInfoArray)
                    
                    return nodeInfoArray
                }`,
                fcl.args([
                    fcl.arg(address, t.Address),
                ]),
            ])
              .then(response => fcl.decode(response), e => console.log(e))
              .then(nodes => {resolve(nodes)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
        return e
    }
}