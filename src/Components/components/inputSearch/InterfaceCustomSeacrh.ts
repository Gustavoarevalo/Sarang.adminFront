// Resultado de la búsqueda (opciones)
export interface CustomSearchPropsApi {
  value: string;
  label: string;
}

export interface IDataSearch {
  idAlumnos: number,
  nameStudend: string
  isCategoria: boolean
  isRefuerzo: boolean
}
export const idtaSearch: IDataSearch = {
  idAlumnos: 0,
  nameStudend: "",
  isCategoria: false,
  isRefuerzo: false
}
// Props para el componente CustomSearch
export interface CustomSearchProps {
  input: string;
  placeholder: string;
  selectLabel?: (value: string) => void;
  selectId?: (id: string | number) => void;
  setinput: (text: string) => void;
  disabled?: boolean;
  color?: string;
  result: CustomSearchPropsApi[];
  required?: boolean;
}
