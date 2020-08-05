import { Paciente } from './paciente';
export class SignosVitales {
    idSignoVital: number;
    paciente: Paciente;
    fecha: string;
    temperatura: string;
    pulso: string;
    ritmoRespiratorio: string;
}