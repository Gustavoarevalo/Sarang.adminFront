//prettier-ignore
const CalcularEdad = (fechaNacimiento: Date, fechaActual: Date): number => {
  try {
    // Obtener los componentes usando UTC
    const newDate = new Date(fechaNacimiento)
    const añoNacimiento = newDate.getUTCFullYear();
    const mesNacimiento = newDate.getUTCMonth();
    const diaNacimiento = newDate.getUTCDate();

    const CurrentDate = new Date(fechaActual)
    const añoActual = CurrentDate.getUTCFullYear();
    const mesActual = CurrentDate.getUTCMonth();
    const diaActual = CurrentDate.getUTCDate();

    let edad = añoActual - añoNacimiento;

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }

    return edad;
  } catch (err) {
    return 0;
  }
};

export default CalcularEdad;
