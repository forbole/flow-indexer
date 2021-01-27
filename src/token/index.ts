import "../utils/env"
import * as global from "../global"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const getSupply = async ():Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
    try{
      return new Promise(function(resolve, reject) {
        fcl.send([
            fcl.script`
            import FlowToken from ${global.contracts.FlowToken}

            pub fun main(): UFix64 {

                let supply = FlowToken.totalSupply

                return supply
            }`
          ])
            .then(response => fcl.decode(response), e => console.log(e))
            .then(supply => {resolve(supply)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
    }
}

export const getBalance = async (address:String):Promise<any> => {
    fcl.config().put("accessNode.api", process.env.ACCESS_NODE)
    try{
      return new Promise(function(resolve, reject) {
        fcl.send([
            fcl.script`
            import FungibleToken from ${global.contracts.FlowToken}
            import FlowToken from 0xTOKENADDRESS

            pub fun main(account: Address): UFix64 {
                let acct = getAccount(account)
                let vaultRef = acct.getCapability(/public/flowTokenBalance)!.borrow<&FlowToken.Vault{FungibleToken.Balance}>()
                    ?? panic("Could not borrow Balance reference to the Vault")

                return vaultRef.balance
            }`,
            fcl.args([
              fcl.arg(address, t.Address), 
            ])
          ])
            .then(response => fcl.decode(response), e => console.log(e))
            .then(supply => {resolve(supply)}, e => console.log(e))
        })
    }
    catch (e){
        console.log(e)
    }
}