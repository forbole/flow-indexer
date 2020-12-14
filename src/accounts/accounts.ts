import { AccessAPI, GetAccountRequest, GetAccountResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import * as sdk from "@onflow/sdk"
import { addressBuffer } from "../utils/address"
import "../utils/env"

export const GetAccount = async (address: string):Promise<void> => {
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

export const SDKGetAccount = async (address: string):Promise<any> => {
    try{
        const response = await sdk.send(await sdk.build([
            sdk.getAccount(address)
        ]), { node: process.env.ACCESS_NODE })
        return response
    }
    catch(e){
        console.log(e)
        return null
    }
}
