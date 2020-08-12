import { AccessAPI, GetTransactionRequest, TransactionResponse, TransactionResultResponse, TransactionStatus } from "@onflow/protobuf"
import { unary } from "../utils/unary"

const getStatus = (status:number):string => {
    for (let s in TransactionStatus){
        if (TransactionStatus[s] === status)
            return s
    }

}

export const GetTransaction = async (txId:string, collectionId:string):Promise<void> => {
    try{
        const req = new GetTransactionRequest()
        req.setId(txId)
        console.log("Get transaction ID: %o", txId)
        const res:TransactionResponse = await unary(AccessAPI.GetTransaction, req)
        console.log(res)
    }
    catch(e){
        console.log(e)
    }
}

export const GetTransactionResult = async (txId:string):Promise<void> => {
    try{
        const req = new GetTransactionRequest()
        req.setId(txId)
        console.log("Get result of transaction ID: %o", txId)
        const res:TransactionResultResponse = await unary(AccessAPI.GetTransactionResult, req)
        console.log(res)
        console.log(getStatus(res.status))
        // console.log(TransactionStatus[2])
        // console.log(TransactionStatus)
    }
    catch(e){
        console.log(e)
    }
}