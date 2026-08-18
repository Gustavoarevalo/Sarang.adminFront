import { driver } from "driver.js";
import { alertglobal } from "../Components/components/sweertAlert/sweertAlert";

type Group =
  | "home"
  | "Precios"
  | "Aprendiz"
  | "Egreso"
  | "Ingresos"
  | "Cobros"
  | "Refuerzos"
  | "Asistencia"
  | "Teorica"
  | "Práctico"
  | "Instructores"
  | "Usuarios"
  | "Vehículos"
  | "Multa"
  | "Tipo Egreso";

const ds = driver({
  showProgress: true,
  nextBtnText: "Siguiente",
  prevBtnText: "Atrás",
  doneBtnText: "Fin",
  animate: true,
});

function allElementsExist(steps: any[]): boolean {
  return steps.some((step) => document.querySelector(step.element) !== null);
}

export const startTour = (group: Group) => {
  let steps: any[] = [];

  switch (group) {
    case "home":
      steps = [
        {
          element: ".menu-home",
          popover: {
            title: "Bienvenido 🚀",
            description:
              "Aqui encontraras las estadisticas de ventas de tu centro y tus alumnos con mas de 90 dias.",
          },
        },
        {
          element: ".Seguimiento",
          popover: {
            title: "Seguimiento de alumnos",
            description: "Listado de procesos con más de 90 días.",
          },
        },
        {
          element: ".menu-download",
          popover: {
            title: "Descargable Excel",
            description:
              "Dando clic descargas el listado de los procesos con 90 dias",
          },
        },
      ];
      break;

    case "Precios":
      steps = [
        {
          element: ".mensual",
          popover: {
            title: "Nombre del plan",
            description:
              "Elije tu plan según la cantidad de vehículos que tengas",
          },
        },
        {
          element: ".card-pago",
          popover: {
            title: "Código QR",
            description:
              "Escanea y realiza el pago de tu plan, guarda el pantallazo soporte de pago.",
          },
        },
        {
          element: ".card-pago-final",
          popover: {
            title: "Envianos tu Pago",
            description:
              "Dale clic en comprar, luego en subir comprobante y carga la imagen de tu soporte.",
            showButtons: ["previous", "close"],
          },
          onHighlighted: () => {
            const btn = document.querySelector(".card-pago-final");
            if (btn) {
              btn.addEventListener(
                "click",
                () => {
                  setTimeout(() => {
                    if (ds.isActive()) {
                      ds.moveNext();
                    }
                  }, 500);
                },
                { once: true }
              );
            }
          },
        },
        {
          element: ".guradarPrice",
          popover: {
            title: "Guardar Comprobante",
            description:
              "Después de subir tu comprobante, presiona este botón para guardarlo y enviarlo correctamente.",
          },
        },
      ];
      break;

    case "Aprendiz":
      steps = [
        {
          element: ".buscarAlumno",
          popover: {
            title: "Buscar y Filtrar Alumnos",
            description: "Tienes 3 métodos para filtrar a tus alumnos.",
          },
        },
        {
          element: ".buscarAlumnoDocument",
          popover: {
            title: "Documento o Nombre",
            description:
              "Escribe el número de documento o nombre del alumno. Al menos 5 dígitos para iniciar la búsqueda.",
          },
        },
        {
          element: ".buscarAlumnofechas",
          popover: {
            title: "Fecha Inscripción",
            description: "Selecciona el día en el que quieras iniciar la búsqueda.",
          },
        },
        {
          element: ".buscarAlumnoState",
          popover: {
            title: "Estado del Alumno",
            description: "Selecciona el estado de los alumnos que quieras buscar.",
          },
        },
        {
          element: ".buscarAlumnoBuscar",
          popover: {
            title: "Buscar",
            description:
              "Una vez seleccionado el método de búsqueda da clic en buscar.",
          },
        },
        {
          element: ".buttonReload",
          popover: {
            title: "Volver al inicio ",
            description:
              "Para volver a visualizar todos los alumnos da clic en este icono",
          },
        },
        {
          element: ".buttonDownload",
          popover: {
            title: "Descarga de Alumnos ",
            description:
              "Dando clic descargas toda tu base de alumnos.",
          },
        },
      ];
      break;

    case "Egreso":
      steps = [
        {
          element: ".filterEgreso",
          popover: {
            title: "Filtros de egresos",
            description:
              "Utiliza las siguientes opciones para encontrar rápidamente egresos específicos.",
          },
        },
        {
          element: ".description",
          popover: {
            title: "Filtrar por descripción",
            description:
              "Busca egresos escribiendo palabras clave relacionadas con la descripción.",
          },
        },
        {
          element: ".valores",
          popover: {
            title: "Filtrar por valor",
            description: "Indica un rango de valores para limitar tu búsqueda.",
          },
        },
        {
          element: ".filterfechasegreso",
          popover: {
            title: "Filtrar por fecha",
            description: "Selecciona un rango de fechas para ver egresos de ese período.",
          },
        },
        {
          element: ".filterEgreso select",
          popover: {
            title: "Tipo de egreso",
            description: "Elige el tipo de egreso que deseas consultar.",
          },
        },
        {
          element: ".filterEgresobutton",
          popover: {
            title: "Aplicar búsqueda",
            description: "Haz clic aquí para ver los egresos según los filtros seleccionados.",
          },
        },
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar nuevo egreso",
            description:
              "Registra un nuevo egreso completando la información correspondiente.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Gestión de egresos",
            description:
              "Aquí verás todos los egresos registrados. Puedes editar o eliminar cualquier registro.",
          },
        },
      ];
      break;

    case "Ingresos":
      steps = [
        {
          element: ".filteringreso",
          popover: {
            title: "Filtros de ingresos",
            description: "Usa estas opciones para buscar ingresos específicos.",
          },
        },
        {
          element: ".valoresIngreso",
          popover: {
            title: "Filtrar por valor",
            description: "Define un rango de montos para tu búsqueda.",
          },
        },
        {
          element: ".searchAlumnoIngreso",
          popover: {
            title: "Buscar por alumno",
            description: "Selecciona el alumno cuyos ingresos quieras consultar.",
          },
        },
        {
          element: ".filterfechasIngreso",
          popover: {
            title: "Filtrar por fecha",
            description: "Selecciona un rango de fechas para tu búsqueda.",
          },
        },
        {
          element: ".filterIngresoSelect",
          popover: {
            title: "Tipo de ingreso",
            description: "Elige el tipo de ingreso que deseas ver.",
          },
        },
        {
          element: ".filteringresobutton",
          popover: {
            title: "Aplicar búsqueda",
            description: "Haz clic aquí para mostrar los ingresos filtrados.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Gestión de ingresos",
            description: "Consulta todos los ingresos registrados en el sistema.",
          },
        },
      ];
      break;

    case "Cobros":
      steps = [
        {
          element: ".filterCobros",
          popover: {
            title: "Filtros de cobros",
            description:
              "Encuentra cobros aplicando distintos métodos de búsqueda.",
          },
        },
        {
          element: ".filterCobrosDesdeHasta",
          popover: {
            title: "Por valor",
            description: "Establece un rango de valores para tu búsqueda.",
          },
        },
        {
          element: ".filterFechasIngresoAlumno",
          popover: {
            title: "Por fecha",
            description: "Selecciona el rango de fechas que deseas consultar.",
          },
        },
        {
          element: ".filterCobrosBucar",
          popover: {
            title: "Buscar por alumno",
            description:
              "Encuentra los cobros realizados por un alumno en específico.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Gestión de cobros",
            description:
              "Aquí se listan todos los cobros registrados. Revisa los detalles de cada uno.",
          },
        },
      ];
      break;

    case "Refuerzos":
      steps = [
        {
          element: ".buscarAlumno",
          popover: {
            title: "Buscar y filtrar alumnos",
            description: "Aplica diferentes filtros para encontrar a tus alumnos.",
          },
        },
        {
          element: ".buscarAlumnoDocument",
          popover: {
            title: "Por documento o nombre",
            description:
              "Escribe el documento o el nombre del alumno para buscar. Requiere al menos 5 caracteres.",
          },
        },
        {
          element: ".buscarAlumnofechas",
          popover: {
            title: "Fecha de inscripción",
            description: "Filtra los alumnos según su fecha de inscripción.",
          },
        },
        {
          element: ".buscarAlumnoState",
          popover: {
            title: "Estado",
            description: "Selecciona el estado actual de los alumnos que quieras ver.",
          },
        },
        {
          element: ".buscarAlumnoBuscar",
          popover: {
            title: "Aplicar búsqueda",
            description: "Haz clic en buscar para mostrar los resultados.",
          },
        },
        {
          element: ".buttonReload",
          popover: {
            title: "Restablecer",
            description:
              "Vuelve a mostrar la lista completa de alumnos sin filtros.",
          },
        },
        {
          element: ".buttonDownload",
          popover: {
            title: "Descargar datos",
            description:
              "Donde veas este icono podrás exportar la información en un archivo Excel.",
          },
        },
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar un refuerzo",
            description:
              "Con este botón podrás registrar un refuerzo para un alumno en la clase seleccionada. Así aseguras que el estudiante pueda recuperar o reforzar el contenido correspondiente.",
          },
        }

      ];
      break;

    case "Asistencia":
      steps = [
        {
          element: ".fechaAsistencia",
          popover: {
            title: "Asistencia Teórica",
            description:
              "Selecciona la fecha para consultar el cronograma de clases teóricas.",
          },
        },
        {
          element: ".buttonBuscarAsistencia",
          popover: {
            title: "Buscar",
            description:
              "Presiona buscar para ver el cronograma. El tour continuará automáticamente después de presionar.",
            showButtons: ["previous", "close"],
          },
          onHighlighted: () => {
            const btn = document.querySelector(".buttonBuscarAsistencia");
            if (btn) {
              btn.addEventListener(
                "click",
                () => {
                  setTimeout(() => {
                    if (ds.isActive()) {
                      ds.moveNext();
                    }
                  }, 500);
                },
                { once: true }
              );
            }
          },
        },
        {
          element: ".buttonAgregarAsistencia",
          popover: {
            title: "Presiona Agregar",
            description: "Para ver el cronograma",
            showButtons: ["close"],
          },
          onHighlighted: () => {
            const btn = document.querySelector(".buttonAgregarAsistencia");
            if (btn) {
              btn.addEventListener("click", () => {
                setTimeout(() => {
                  if (ds.isActive()) {
                    ds.moveNext();
                  }
                }, 300);
              });
            }
          },
        },
        {
          element: ".infoInstructorAsistencia",
          popover: {
            title: "Información del instructor",
            description:
              "Verás la información del instructor con el cronograma seleccionado.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Información de los alumnos",
            description:
              "En esta tabla se listan todos los alumnos registrados en la asistencia.",
          },
        },
      ];
      break;

    case "Teorica":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar Cronograma",
            description:
              "Registra un nuevo cronograma de clases prácticas asignando instructor, fecha, tema y horario.",
          },
        },
        {
          element: ".inputFechaCronogramaTeorica",
          popover: {
            title: "Fecha del cronograma",
            description:
              "Selecciona la fecha para consultar el cronograma de clases teóricas.",
          },
        },
        {
          element: ".buttonBuscarAsistencia",
          popover: {
            title: "Buscar cronograma",
            description:
              "Haz clic para cargar el cronograma correspondiente a la fecha seleccionada.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Listado de alumnos",
            description:
              "Revisa la lista de alumnos inscritos en la clase teórica seleccionada.",
          },
        },
      ];
      break;

    case "Práctico":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar Clase Práctica",
            description:
              "Desde aquí puedes registrar nuevas clases prácticas para los alumnos, asignando instructor, vehículo y horario.",
          },
        },
        {
          element: ".cronogrmapagew",
          popover: {
            title: "Consultar clases por instructor y fecha",
            description:
              "Primero selecciona el instructor y el rango de fechas que deseas revisar. Después presiona el botón Buscar para ver el resultado.",
          },
        },
        {
          element: ".card_date",
          popover: {
            title: "Instructor y horas de clase",
            description:
              "En esta tarjeta puedes ver el nombre del instructor junto con las horas programadas: prácticas, teóricas y el total acumulado.",
          },
        },
      ];
      break;

    case "Instructores":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar instructor",
            description: "Registra un nuevo instructor en el sistema.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Listado de instructores",
            description:
              "Consulta todos los instructores registrados, con opción a editar o eliminar.",
          },
        },
        {
          element: ".btnHorarioInstructores",
          popover: {
            title: "Registrar horarios",
            description:
              "Indica los horarios en los que el instructor no estará disponible.",
          },
        },
        {
          element: ".btnHorarioInstructoresCalendario",
          popover: {
            title: "Calendario del instructor",
            description:
              "Visualiza los días y horarios donde el instructor ya tiene clases asignadas.",
          },
        },
      ];
      break;

    case "Usuarios":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar usuario",
            description: "Crea un nuevo usuario con sus respectivos permisos.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Gestión de usuarios",
            description: "Aquí verás todos los usuarios registrados en la plataforma.",
          },
        },
      ];
      break;

    case "Vehículos":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar vehículo",
            description: "Registra un nuevo vehículo en el sistema.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Listado de vehículos",
            description:
              "Consulta todos los vehículos registrados y administra su información.",
          },
        },
      ];
      break;

    case "Multa":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar multa",
            description: "Registra una nueva multa asociada a un alumno o vehículo.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Gestión de multas",
            description:
              "Visualiza todas las multas registradas y edita su información si es necesario.",
          },
        },
      ];
      break;

    case "Tipo Egreso":
      steps = [
        {
          element: ".btnGlobal",
          popover: {
            title: "Agregar tipo de egreso",
            description: "Crea un nuevo tipo de egreso para organizar tus registros.",
          },
        },
        {
          element: ".crudtabletGolbal",
          popover: {
            title: "Listado de tipos de egreso",
            description:
              "Consulta todos los tipos de egreso registrados en el sistema.",
          },
        },
      ];
      break;
  }

  if (steps.length > 0 && allElementsExist(steps)) {
    ds.setSteps(steps);
    ds.drive();
  } else {
    alertglobal("info","No hay tour disponible para esta sección 🚫","info");
  }
};
