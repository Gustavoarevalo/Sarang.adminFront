export const EsHoraValida = (horaInicio: string, horaFin: string): boolean => {
  const convertirAHora = (hora: string): number => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
  };

  const inicio = convertirAHora(horaInicio);
  const fin = convertirAHora(horaFin);
  return fin > inicio;
};

// Formato hh:mm para mostrar
export const formatHoras = (horas: number) => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
};
