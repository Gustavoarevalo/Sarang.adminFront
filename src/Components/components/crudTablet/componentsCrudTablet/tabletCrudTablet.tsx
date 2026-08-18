import { ReactNode, useEffect, useState } from "react";
import { sortArrayByKey } from "./filterCrudTablet";
import { CrudTabletAction, IGridColumnModelCrudTable, TabletCrudTabletProps } from "../interfaceCrudtablet";
import { OverlayTrigger, Tooltip, } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { fechaEnEspañol } from "../../../../helper/FechasFunction";
import { AlertGlobalOptions } from "../../sweertAlert/sweertAlert";

//prettier-ignore 
const TabletCrudTablet = ({ data, GridColumnGroupingModel, hiddenAccion3, NotViewData, chunk, disabled, disabledEdit, hiddenEdit, onClickEdit, disabledDelete, hiddenDelete, onClickDelete, disabledEye, hiddenEye, onClickEye, newAccion1, newAccion2, newAccion3, newAccion4, onclickAccion1, onclickAccion2, onclickAccion3, onclickAccion4, hiddenAccion4 }: TabletCrudTabletProps) => {
    const [Header, setHeader] = useState<string[]>([]);
    const [dataSort, setDataSort] = useState<{ [key: string]: any }[]>([]);

    useEffect(() => {
        setHeader(data[0] ? (NotViewData ? Object.keys(data[0]).filter((key) => !NotViewData.includes(key)) : Object.keys(data[0])) : ['']);
        setDataSort(data);
    }, [data, NotViewData]);

    const handleSort = (e: string) => {
        const sortedData = sortArrayByKey([...dataSort], e);
        setDataSort(sortedData);
    }

    const HandleDelete = async (Body) => {
        if (await AlertGlobalOptions("¿Estas seguro de eliminar este registro?", "Si", "No", "warning")) {
            onClickDelete ? onClickDelete(Body) : null
        }
    }

    const renderAction = (action: CrudTabletAction, Body: { [key: string]: any }) => {
        return typeof action === "function" ? action(Body) : action;
    }

    const OnchangeGroupColumn = (header: string[], grid?: IGridColumnModelCrudTable[]): ReactNode => {
        const displayedHeaders = new Set<string>();
        const response = header.map((e) => {
            const gridColumn = grid && grid.find((g) =>
                g.children.some((child) => child.field === e)
            );
            if (gridColumn) {
                const uniqueKey = `${gridColumn.headerName}-${gridColumn.children[0].field}`;
                if (!displayedHeaders.has(uniqueKey)) {
                    displayedHeaders.add(uniqueKey);
                    return (
                        <th key={uniqueKey} colSpan={gridColumn.children.length} className={`${gridColumn.headerClassName}`}>
                            <span>
                                {gridColumn.headerName}
                            </span>
                        </th>
                    );
                }
            } else {
                return (
                    <th key={e} >
                        <span>
                            {""}
                        </span>
                    </th>
                );
            }
            return null;
        });
        return response.filter((element) => element !== null);
    };

    return (dataSort.length > 0 &&
        <>
            <div className="table-responsive">
                <Table className="table-bordered text-nowrap border-bottom">
                    <thead>
                        <tr>
                            {GridColumnGroupingModel && OnchangeGroupColumn(Header, GridColumnGroupingModel)}
                        </tr>
                        <tr>
                            {Header.length > 0 &&
                                Header.map((el) => (
                                    <th
                                        key={el}
                                        className="text-center align-middle  border-bottom-0"
                                        style={{ wordBreak: 'break-word' }}
                                    >
                                        <span className="tabletitle h6">
                                            {el.toUpperCase()}
                                        </span>
                                        <button
                                            className="btn btn-sm p-1 ms-2"
                                            onClick={() => handleSort(el)}
                                        >
                                            <i className="fa fa-sort text-primary"></i>
                                        </button>
                                    </th>
                                ))}
                            {(hiddenEye || hiddenEdit || newAccion1 || newAccion2 || newAccion3 || newAccion4 || hiddenDelete) && (
                                <th className="text-center align-middle text-wrap border-bottom-0">
                                    <span className="tabletitle">
                                        Acciones
                                    </span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dataSort &&
                            dataSort.slice(chunk.firstContentIndex, chunk.lastContentIndex).map((Body, rowIndex) => {
                                return (
                                    <tr key={rowIndex} className="text-center">
                                        {Header.length > 0 &&
                                            Header.map((el, colIndex) => {
                                                return (
                                                    <td
                                                        className="align-middle text-wrap"
                                                        key={colIndex}
                                                        style={{
                                                            wordBreak: 'break-word',
                                                            maxWidth: '150px',
                                                        }}
                                                    >
                                                        <span className="font-normal text-sm">
                                                            {Body ? Body[el] instanceof Date ? fechaEnEspañol(Body[el]) : Body[el] : ''}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        {(hiddenEye || hiddenEdit || newAccion1 || newAccion2 || newAccion3 || newAccion4 || hiddenDelete) && (
                                            <td className="justify-content-center">
                                                {newAccion1 && (
                                                    <button
                                                        className="btn btn-sm m-1"
                                                        onClick={() =>
                                                            onclickAccion1 ? onclickAccion1(Body) : null
                                                        }
                                                    >
                                                        {renderAction(newAccion1, Body)}
                                                    </button>
                                                )}
                                                {hiddenEye && (
                                                    <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-primary">Ver</Tooltip>}>
                                                        <button
                                                            className="btn btn-sm btn-success m-1"
                                                            disabled={disabled || disabledEye}
                                                            onClick={() =>
                                                                onClickEye ? onClickEye(Body) : null
                                                            }
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                    </OverlayTrigger>
                                                )}
                                                {hiddenEdit && (
                                                    <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-primary">Editar</Tooltip>}>
                                                        <button
                                                            className="btn btn-sm btn-info m-1"
                                                            disabled={disabled || disabledEdit}
                                                            onClick={() =>
                                                                onClickEdit ? onClickEdit(Body) : null
                                                            }
                                                        >
                                                            <i className="fa fa-edit"></i>
                                                        </button>
                                                    </OverlayTrigger>
                                                )}
                                                {hiddenDelete && (
                                                    <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-primary">Eliminar</Tooltip>}>
                                                        <button
                                                            className="btn btn-sm btn-danger m-1"
                                                            disabled={disabled || disabledDelete}
                                                            onClick={() => HandleDelete(Body)}
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </OverlayTrigger>
                                                )}
                                                {newAccion2 && (
                                                    <button className="btn btn-sm m-1" onClick={() => onclickAccion2 ? onclickAccion2(Body) : null}>
                                                        {renderAction(newAccion2, Body)}
                                                    </button>
                                                )}
                                                {newAccion3 && hiddenAccion3 && (
                                                    <button
                                                        className="btn btn-sm m-1"
                                                        onClick={() =>
                                                            onclickAccion3 ? onclickAccion3(Body) : null
                                                        }
                                                    >
                                                        {renderAction(newAccion3, Body)}
                                                    </button>
                                                )}
                                                {newAccion4 && hiddenAccion4 && (
                                                    <button
                                                        className="btn btn-sm m-1"
                                                        onClick={() =>
                                                            onclickAccion4 ? onclickAccion4(Body) : null
                                                        }
                                                    >
                                                        {renderAction(newAccion4, Body)}
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>

        </>
    )
}

export default TabletCrudTablet;
