import { AccessAPI, GetAccountRequest, GetAccountResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => paddedHexBuffer(addr, 8)

export const GetAccount = async (address: string):Promise<void> => {
    try{
        const req = new GetAccountRequest()
        console.log(addressBuffer(address))
        req.setAddress(paddedHexBuffer(Buffer.from(address).toString('hex'),8))
        console.log("Get account address: %o", address)
        const res:GetAccountResponse = await unary(AccessAPI.GetAccount, req)
        console.log(res)
    }
    catch(e){
        console.log(e)
    }
}