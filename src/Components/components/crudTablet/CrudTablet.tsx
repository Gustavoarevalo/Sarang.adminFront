import TabletCrudTablet from "./componentsCrudTablet/tabletCrudTablet";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { ChunkCrudTabletProps, CrudTabletAction, DefaultChunkCrudTablet, IGridColumnModelCrudTable } from "./interfaceCrudtablet";
import './CsscrudTablet.css'
import { PaginationBackend } from "./componentsCrudTablet/pagination/paginationBackend/paginationBackend";
import { Button, Card, Col, Row } from 'react-bootstrap';
import ModalChangeLoading from "../ModalChange";
import Pageheader from "../../Layouts/Pageheader/Pageheader";
import { InterPerPages } from "./componentsCrudTablet/itemPerPage";
import { PaginationCrudTablet } from "./componentsCrudTablet/pagination/paginationCrudTable/paginationCrudTablet";

export interface CrudTabletProps {
    //titulo de la tabla que se encuentra en el header 
    tittle?: string;
    active?: string;
    _InterPerPages?: number
    // Titulo del Boton Que esta del lado derecho de la tabla
    tittleButton?: string
    tittleButtonSecondary?: string
    hiddenButton?: boolean
    onclickButtonPrimary?: (e: any) => void
    onclickButtonSecondary?: (e: any) => void
    //data es un array de objetos se va a utlizar para la tabla
    data: { [key: string]: any }[]
    // array de string para no mostrar en la tabla pero si en los archivos de descarga
    NotViewData?: string[]
    //se coloca opciones en el header para agregar mas funcionalidades
    Children?: React.ReactNode
    // bloquea todos los elementos de la tabla
    disabled?: boolean
    // bloquea el boton de editar
    disabledEdit?: boolean
    //no visualiza el boton de editar
    hiddenEdit?: boolean
    //evento cuando se presiona el boton de editar
    onClickEdit?: (e: any) => void;
    // bloquea el boton de eliminar
    disabledDelete?: boolean
    //no visualiza el boton de Delete 
    hiddenDelete?: boolean
    //evento cuando se presiona el boton de Delete
    onClickDelete?: (e: any) => void;
    // bloquea el boton de ver
    disabledEye?: boolean
    //no visualiza el boton de visualizar
    hiddenEye?: boolean
    //evento cuando se presiona el boton de ver
    onClickEye?: (e: any) => void;
    //elimina el input de busqueda
    hiddenSearch?: boolean

    GridColumnGroupingModel?: IGridColumnModelCrudTable[];

    //#region accione que obtiene un jsx si se desean colocar uno o varios botones, nuevos botones que no existen en la tabla
    // el newAccion1 es el boton que se coloca en la tabla adelante del editar
    newAccion1?: CrudTabletAction
    onclickAccion1?: (e: any) => void
    // el newAccion2 es el boton que se coloca en la tabla adelante del ver
    newAccion2?: CrudTabletAction
    onclickAccion2?: (e: any) => void
    // el newAccion3 es el boton que se coloca en la tabla adelante del Eliminar
    newAccion3?: CrudTabletAction
    onclickAccion3?: (e: any) => void
    hiddenAccion3?: boolean
    // el newAccion4 es el boton que se coloca en la tabla adelante del Eliminar
    newAccion4?: CrudTabletAction
    onclickAccion4?: (e: any) => void
    hiddenAccion4?: boolean


    //#endregion

    //abre el Loading (cargando) mientras se realiza una accion
    ChangeLoading?: boolean;


    // nombre de los archivos cuando se descarga el excell
    nombreArchivoExcel?: string
    // nombre de los archivos cuando se descarga el csv
    nombreArchivoCSV?: string


    hiddenExcel?: boolean
    hiddenCSV?: boolean
    hiddenDownload?: boolean

    //se coloca encima de la tabla para agregar mas funcionalidades
    ChildrenHeader?: React.ReactNode

    //paginacion por backend 
    //cantidad de paginas por backend
    countPage?: number
    //chunk de la tabla
    RenderChunk?: (e: ChunkCrudTabletProps) => void

    RenderColumn?: (value: any, column: string, data?: { [key: string]: any }) => ReactNode;
    countRegister?: number
    downloadExcel?: () => void

    hiddenButtonSecondary?: boolean

     ViewPaginationsimpletable?: boolean // esto es para mostrar una paginacion simple sin importar la cantidad de registros, se muestra el numero de pagina actual y el total de paginas, ademas de botones para avanzar o retroceder una pagina
}

//prettier-ignore  
const CrudTablet = memo(({ onclickButtonSecondary, hiddenButtonSecondary, _InterPerPages = InterPerPages, countRegister, tittle, active = 'Default Tittle', tittleButton = 'Agregar', tittleButtonSecondary = '', hiddenButton = false, onclickButtonPrimary, data = [], GridColumnGroupingModel, NotViewData, Children, disabled, disabledEdit, hiddenEdit = false, onClickEdit, disabledDelete, hiddenDelete = false, onClickDelete, disabledEye, hiddenEye, onClickEye, newAccion1, newAccion2, newAccion3, newAccion4, ChangeLoading, nombreArchivoCSV, nombreArchivoExcel, hiddenExcel, hiddenCSV, hiddenDownload, ChildrenHeader, countPage, RenderChunk, hiddenSearch, onclickAccion1, onclickAccion2, onclickAccion3, onclickAccion4, RenderColumn, hiddenAccion4 = false, downloadExcel, hiddenAccion3 = false }: CrudTabletProps) => {
    const [chunk, setChunk] = useState<ChunkCrudTabletProps>(DefaultChunkCrudTablet(_InterPerPages));

    useEffect(() => {
        if (countRegister) {
            setChunk((prev) => ({ ...prev, lastContentIndex: countRegister }))
        }
    }, [countRegister])

    const tablaCrud = useCallback((data: { [key: string]: any }[], NotViewData: string[], chunk: ChunkCrudTabletProps, disabled: boolean = false, disabledEdit: boolean = false, hiddenEdit: boolean = false, disabledDelete: boolean = false, hiddenDelete: boolean = false, disabledEye: boolean = false,
        hiddenEye: boolean = false, onClickEdit: (e: any) => void, onClickDelete: (e: any) => void, onClickEye: (e: any) => void, newAccion1: CrudTabletAction, newAccion2: CrudTabletAction, newAccion3: CrudTabletAction,
        newAccion4: CrudTabletAction, onclickAccion1: (e: any) => void, onclickAccion2: (e: any) => void, onclickAccion3: (e: any) => void, onclickAccion4: (e: any) => void, hiddenAccion4: boolean, RenderColumn?: (value: any, column: string) => ReactNode,
        GridColumnGroupingModel?: IGridColumnModelCrudTable[],
    ) => {
        return (
            <TabletCrudTablet
                data={data}
                NotViewData={NotViewData}
                chunk={chunk}
                disabled={disabled}
                disabledEdit={disabledEdit}
                hiddenEdit={hiddenEdit}
                disabledDelete={disabledDelete}
                hiddenDelete={hiddenDelete}
                disabledEye={disabledEye}
                hiddenEye={hiddenEye}
                onClickEdit={onClickEdit}
                onClickDelete={onClickDelete}
                onClickEye={onClickEye}
                newAccion1={newAccion1}
                newAccion2={newAccion2}
                newAccion3={newAccion3}
                newAccion4={newAccion4}
                onclickAccion1={onclickAccion1}
                onclickAccion2={onclickAccion2}
                onclickAccion3={onclickAccion3}
                onclickAccion4={onclickAccion4}
                RenderColumn={RenderColumn}
                GridColumnGroupingModel={GridColumnGroupingModel}
                hiddenAccion3={hiddenAccion3}
                hiddenAccion4={hiddenAccion4}
            />
        )
    }, [])

    return (
        <div >
            <ModalChangeLoading open={ChangeLoading ? ChangeLoading : false} />
            <Pageheader titles={active} active={active} downloadExcel={downloadExcel ? () => downloadExcel() : undefined} />
            <>
                {ChildrenHeader}
            </>
            <Row className="row-sm">
                <Col lg={12}>
                    <Card>

                        <Card.Header className="d-flex justify-content-between">
                            <Card.Title as="h3">{tittle}</Card.Title>

                            <div className="d-flex flex-column gap-2" style={{ minWidth: "180px" }}>
                                {hiddenButton && (
                                    <Button variant="primary" className="btnGlobal w-100" onClick={() => onclickButtonPrimary && onclickButtonPrimary(data)}  >
                                        {tittleButton}
                                    </Button>
                                )}

                                {hiddenButtonSecondary && (
                                    <Button variant="secondary" className="btnGlobal w-100" onClick={() => onclickButtonSecondary && onclickButtonSecondary(data)}  >
                                        {tittleButtonSecondary}
                                    </Button>
                                )}
                            </div>
                        </Card.Header>

                        <Card.Body>

                            <div>
                                {Children}
                            </div>

                            <div className="crudtabletGolbal">

                                {tablaCrud(data, NotViewData || [], chunk, disabled, disabledEdit, hiddenEdit, disabledDelete,
                                    hiddenDelete, disabledEye, hiddenEye, (e) => onClickEdit ? onClickEdit(e) : null,
                                    (e) => onClickDelete ? onClickDelete(e) : null, (e) => onClickEye ? onClickEye(e) : null,
                                    newAccion1, newAccion2, newAccion3, newAccion4, (e) => onclickAccion1 ? onclickAccion1(e) : null,
                                    (e) => onclickAccion2 ? onclickAccion2(e) : null, (e) => onclickAccion3 ? onclickAccion3(e) : null,
                                    (e) => onclickAccion4 ? onclickAccion4(e) : null, hiddenAccion4, RenderColumn, GridColumnGroupingModel,

                                )}

                            </div>

                            {(countPage === undefined && countRegister === undefined) ? (
                                <div>
                                    {(data.length >= _InterPerPages) && (
                                        <div>
                                            <PaginationCrudTablet items={data.length} itemPerPage={_InterPerPages} setChunk={setChunk} />
                                        </div>
                                    )}
                                </div>
                            ) : (

                                <div>
                                    {(data.length > 0 && countPage !== undefined && countPage > _InterPerPages) && (
                                        <div>
                                            <PaginationBackend items={countPage ?? 0} itemPerPage={_InterPerPages} setChunk={(e) => RenderChunk && RenderChunk(e)} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
})

export default CrudTablet;
