import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column()
    email: string;

    // Por motivos de simplicidad, vamos a guardar la contraseña en texto plano
    // No he cambiado la configuracion de esto para que las contraseñas
    // se guarden encriptadas por este comentario, si que creo que es importante
    // por seguridad.
    @Column()
    pass: string;

    @OneToMany(() => Task, (task) => task.owner)
    tasks: Task[];
}
