import { PacienteService } from './../../../_service/paciente.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Paciente } from './../../../_model/paciente';
import { SignosVitales } from './../../../_model/signos-vitales';
import { FormControl } from '@angular/forms';
import { SignosVitalesService } from './../../../_service/signos-vitales.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {
  
  id: number;
  edicion: boolean;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  signosVitales: SignosVitales = new SignosVitales();
  pacientesFiltrados: Observable<Paciente[]>;
  myControlPaciente: FormControl = new FormControl();
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente = new Paciente();

  constructor(
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private signosVitalesService: SignosVitalesService
  ) { }

  ngOnInit(): void {
    
    this.listarPacientes();
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  initForm() {
    if (this.edicion) {
      this.signosVitalesService.listarPorId(this.id).subscribe(data => {
        this.signosVitales = data;
        this.pacienteSeleccionado = this.signosVitales.paciente;
        this.myControlPaciente.setValue(this.pacienteSeleccionado);
        this.fechaSeleccionada = new Date(this.signosVitales.fecha)
      });
    }
  }

  operar() {

    
    this.signosVitales.paciente = this.pacienteSeleccionado;
    this.signosVitales.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');

    if (this.edicion) {
      this.signosVitalesService.modificar(this.signosVitales).subscribe(() => {
        this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
          this.signosVitalesService.signosVitalesCambio.next(data);
          this.signosVitalesService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      this.signosVitalesService.registrar(this.signosVitales).subscribe(() => {
        this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
          this.signosVitalesService.signosVitalesCambio.next(data);
          this.signosVitalesService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signos-vitales']);
    
  }

  estadoBotonRegistrar() {
    return (!this.pacienteSeleccionado.idPaciente || !this.fechaSeleccionada || !this.signosVitales.pulso
      || !this.signosVitales.ritmoRespiratorio || !this.signosVitales.temperatura);
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }    
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

}
