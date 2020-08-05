import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignosVitalesService } from './../../_service/signos-vitales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SignosVitales } from 'src/app/_model/signos-vitales';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idSignoVital', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  dataSource: MatTableDataSource<SignosVitales>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.signosVitalesService.signosVitalesCambio.subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    this.signosVitalesService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })

    this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSignoVital: number) {
    this.signosVitalesService.eliminar(idSignoVital).subscribe(() => {
      this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
        this.signosVitalesService.signosVitalesCambio.next(data);
        this.signosVitalesService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any) {
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
