import {Entity, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Collection extends BaseEntity{

    @PrimaryColumn()
    id: string;

    @Column("json")
    transactionIds: string[];

    @Column({type: "boolean", default:false})
    processed: boolean
    
}