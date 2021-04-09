import {Entity, Unique, Index, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import {Block} from "./Block";
@Entity()
@Unique(["id"])
export class Collection extends BaseEntity{

    @PrimaryColumn()
    id: string;

    @Column({nullable: true, type:"json"})
    transactionIds: string[];

    @Column({type: "boolean", default:false})
    processed: boolean
    
    @Column()
    @Index("collection_height_idx")
    height: number

    @ManyToOne(type => Block)
    @JoinColumn({
        name: "height",
        referencedColumnName: "height"
    })
    block?: Block
}