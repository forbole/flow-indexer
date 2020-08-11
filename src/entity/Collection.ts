import {Entity, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Collection extends BaseEntity{

    @PrimaryColumn()
    id: string;

    @Column("json")
    transaction_ids: string[];
    
}