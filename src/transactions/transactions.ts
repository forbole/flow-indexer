import { AccessAPI, GetTransactionRequest, TransactionResponse, TransactionResultResponse, TransactionStatus } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { Transaction } from "../entity/Transaction"
import { TransactionResult } from "../entity/TransactionResult"

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

        const tx:Transaction = new Transaction()

        tx.id = txId
        tx.script = res.transaction.script
        tx.arguments = res.transaction.argumentsList
        tx.referenceBlockId = res.transaction.referenceBlockId
        tx.gasLimit = res.transaction.gasLimit
        tx.proposalKey = res.transaction.proposalKey
        tx.payer = res.transaction.payer
        tx.authorizers = res.transaction.authorizersList
        tx.payloadSignatures = res.transaction.payloadSignaturesList
        tx.envelopeSignatures = res.transaction.envelopeSignaturesList
        tx.transactionResult = await GetTransactionResult(txId)
        
        
        await Transaction.save(tx)

        
    }
    catch(e){
        console.log(e)
    }
}

export const GetTransactionResult = async (txId:string):Promise<TransactionResult> => {
    try{
        const req = new GetTransactionRequest()
        req.setId(txId)
        console.log("Get result of transaction ID: %o", txId)
        const res:TransactionResultResponse = await unary(AccessAPI.GetTransactionResult, req)
        console.log(res)
        console.log()

        const txRes = new TransactionResult()
        txRes.status = getStatus(res.status)
        txRes.statusCode = res.statusCode
        txRes.errorMessage = res.errorMessage
        txRes.events = res.eventsList

        return txRes
    }
    catch(e){
        console.log(e)
    }
}