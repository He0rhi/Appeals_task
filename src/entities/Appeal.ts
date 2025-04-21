import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";
@Entity()
export class Appeal{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    theme!:string;

    @Column("text")
    text!: string;

    @Column({
        type:"enum",
        enum: ["new", "in_progress", "completed", "canceled"],
        default:"new",
    })
    status!:string;




    @Column({ type: "text", nullable: true })
    resolution!: string | null;

    @Column({ type: "text", nullable: true })
    cancellationReason!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

     @UpdateDateColumn()
    updatedAt!: Date;
}