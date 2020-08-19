import { Event } from "../entity/Event"

export class TransactionResult{
    status: string
    statusCode: number
    errorMessage: string
    events: Event[]
}
