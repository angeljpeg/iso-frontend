import type {
  CreateAsesoriaService,
  GetAllAsesoriasService,
  GetAsesoriaByIdService,
  GetAsesoriasByCargaAcademicaService,
  UpdateAsesoriaService,
  DeleteAsesoriaService,
  TestRelationsService,
} from "./index";

export interface AsesoriasService
  extends CreateAsesoriaService,
    GetAllAsesoriasService,
    GetAsesoriaByIdService,
    GetAsesoriasByCargaAcademicaService,
    UpdateAsesoriaService,
    DeleteAsesoriaService,
    TestRelationsService {}
