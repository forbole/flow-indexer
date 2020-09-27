import {Entity, Unique, Index, PrimaryColumn, Column, BaseEntity} from "typeorm";
import { BlockSeal } from './BlockSeal'
import { CollectionGuarantee } from './CollectionGuarantee'

@Entity()
@Unique(["id"])
@Unique(["parentId"])
@Unique(["height"])
export class Block extends BaseEntity{

    @PrimaryColumn()
    id: string

    @PrimaryColumn()
    parentId: string

    @PrimaryColumn()
    @Index("block_height_idx")
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
