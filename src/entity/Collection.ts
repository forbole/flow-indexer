import {Entity, Unique, Index, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
@Unique(["id"])
export class Collection extends BaseEntity{

    @PrimaryColumn()
    id: string;

    @Column("json")
    transactionIds: string[];

    @Column({type: "boolean", default:false})
    processed: boolean
    
    @Column()
    @Index("collection_height_idx")
    height: number
}