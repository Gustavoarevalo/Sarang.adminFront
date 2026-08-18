import { format } from "date-fns";
import { es } from "date-fns/locale";

export const fechaEnEspañol = (date: Date | string) => {
  const fecha = new Date(date);

  const esHoraPlana = fecha.getUTCHours() === 0 && fecha.getUTCMinutes() === 0 && fecha.getUTCSeconds() === 0;

  if (esHoraPlana) {
    fecha.setHours(fecha.getHours() + 5);
  }

  return format(fecha, "EEEE, PPP", { locale: es });
};


export const fechaFormatoGMT = (date: Date | string): Date => {
  let dateStr = typeof date === 'string' ? date : date.toISOString();

  const fechaLimpia = dateStr.split('Z')[0].split('+')[0];

  const fecha = new Date(fechaLimpia);

  fecha.setMinutes(fecha.getMinutes() + 2);

  return fecha;
};

export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};



export const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time);