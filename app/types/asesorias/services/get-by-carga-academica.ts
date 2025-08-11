export interface GetAsesoriasByCargaAcademicaService {
  getByCargaAcademicaId: (cargaAcademicaId: string) => Promise<any[]>;
}
