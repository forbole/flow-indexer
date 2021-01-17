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