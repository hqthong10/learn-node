import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 100 })
    name: string

    @Column({ unique: true })
    email: string

    @Column({ 
        type: "enum", 
        enum: ["active", "inactive"], 
        default: "active" 
    })
    status: string

    @CreateDateColumn()
    created_at: Date
}