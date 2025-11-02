import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;
    // Creo que seria importante que esto se iniicializara en false, por una cuestion de limpieza, pero no estoy seguro de que esta sea la mejor opcion
    // o si existe algun motivo por el que no se ha realizado, este tipo de cosas relacionadas con la  base de datos prefiero preguntarlas y sopesarlas
    @Column()
    done: boolean;

    @Column()
    dueDate: string;

    @ManyToOne(() => User, (user) => user.tasks)
    owner: User;
}
