import { InterPerPages } from "../Components/components/crudTablet/componentsCrudTablet/itemPerPage";

export type typeOperacion = "Agregar" | "Editar";

export interface IgetApiResponseProps<T extends unknown> {
    countPage: number;
    listarRegistros: T;
}

//prettier-ignore
export const DataDefaultGetApiResponse = <T,>(listaRegistro: T): IgetApiResponseProps<T> => {
    return {
        countPage: 0,
        listarRegistros: listaRegistro
    };
};

export interface postIDropBoxGlobal extends IDropBoxGlobal { }

export interface IDropBoxGlobal {
    value: number;
    label: string
}
export const DropBoxGlobal: IDropBoxGlobal = {
    value: 0,
    label: ''
}

export interface IFilterGlobal {
    skip: number,
    take: number
}

export const DataDefaultFilter: IFilterGlobal = {
    skip: 0,
    take: InterPerPages
}