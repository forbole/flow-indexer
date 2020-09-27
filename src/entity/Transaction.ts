import { Entity, Unique, Index, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { TransactionProposalKey } from "./TransactionProposalKey"
import { TransactionSignature } from "./TransactionSignature"
import { TransactionResult } from "./TransactionResult";
import { Block } from "./Block"

@Entity()
@Unique(["id"])
export class Transaction extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column('text')
    script: string

    @Column({type:'varchar', array:true})
    arguments: string[]

    @Column()
    @Index("transaction_block_id_idx")
    referenceBlockId: string

    @Column('bigint')
    gasLimit: number

    @Column('jsonb')
    proposalKey: TransactionProposalKey

    @Column()
    payer: string

    @Column({type:'varchar', array:true})
    authorizers: string[]

    @Column('jsonb')
    payloadSignatures: TransactionSignature[]

    @Column('jsonb')
    envelopeSignatures: TransactionSignature[]

    @Column({ nullable: true, type: "jsonb" })
    transactionResult: TransactionResult

    @ManyToOne(type => Block)
    @JoinColumn({
        name: "referenceBlockId",
        referencedColumnName: "id"
    })
    expireBlock?: Block
}