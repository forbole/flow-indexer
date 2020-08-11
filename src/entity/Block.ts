import {Entity, PrimaryColumn, Column, BaseEntity} from "typeorm";
import { BlockSeal } from './BlockSeal'
import { CollectionGuarantee } from './CollectionGuarantee'

@Entity()
export class Block extends BaseEntity{

    @PrimaryColumn()
    id: string

    @PrimaryColumn()
    parentId: string

    @PrimaryColumn()
    height: number

    @Column("json")
    timestamp

    @Column("jsonb")
    collectionGuarantees: CollectionGuarantee[]
    
    @Column("jsonb")
    blockSeals: BlockSeal[]

    @Column("text")
    signatures: string[]

    @Column({type:"float", default:0})
    blockTime
}
