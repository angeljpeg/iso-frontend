export enum TipoNecesidadEspecial {
  CONDUCTUALES = 'Conductuales',
  COMUNICACIONALES = 'Comunicacionales',
  INTELECTUALES = 'Intelectuales',
  FISICAS = 'Físicas',
  SUPERDOTACION = 'Superdotación',
  OTRAS = 'Otras'
}

export enum TipoExcepcion {
  CONDUCTUALES = 'excepcionesConductuales',
  COMUNICACIONALES = 'excepcionesComunicacionales',
  INTELECTUALES = 'excepcionesIntelectuales',
  FISICAS = 'excepcionesFisicas',
  SUPERDOTACION = 'excepcionesSuperdotacion'
}

export const TIPOS_NECESIDAD_OPTIONS = [
  { value: TipoExcepcion.CONDUCTUALES, label: TipoNecesidadEspecial.CONDUCTUALES },
  { value: TipoExcepcion.COMUNICACIONALES, label: TipoNecesidadEspecial.COMUNICACIONALES },
  { value: TipoExcepcion.INTELECTUALES, label: TipoNecesidadEspecial.INTELECTUALES },
  { value: TipoExcepcion.FISICAS, label: TipoNecesidadEspecial.FISICAS },
  { value: TipoExcepcion.SUPERDOTACION, label: TipoNecesidadEspecial.SUPERDOTACION }
];
