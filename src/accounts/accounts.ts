import { AccessAPI, GetAccountRequest, GetAccountResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { addressBuffer } from "../utils/address"

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