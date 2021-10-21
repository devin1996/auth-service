import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{

    
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({default: "name"})
    name: string;

    @Column({default: "admin@emaisms.com"})
    email: string;

    @Column({default: "admin@12345"})
    password: string;





}

