import { Card } from "react-bootstrap"
import { CrudTabletProps } from "./CrudTablet"
import { memo, ReactNode, useCallback, useState } from "react"
import { InterPerPages } from "./componentsCrudTablet/itemPerPage"
import TabletCrudTablet from "./componentsCrudTablet/tabletCrudTablet"
import { PaginationBackend } from "./componentsCrudTablet/pagination/paginationBackend/paginationBackend"
import { ChunkCrudTabletProps, CrudTabletAction, DefaultChunkCrudTablet, IGridColumnModelCrudTable } from "./interfaceCrudtablet"
import { PaginationCrudTablet } from "./componentsCrudTablet/pagination/paginationCrudTable/paginationCrudTablet"

const TablaSencilla = memo(({ _InterPerPages = InterPerPages, countRegister, tittle, active = 'Default Tittle', tittleButton = 'Agregar', hiddenButton = false, onclickButtonPrimary, data = [], GridColumnGroupingModel, NotViewData, Children, disabled, disabledEdit, hiddenEdit = false, onClickEdit, disabledDelete, hiddenDelete = false, onClickDelete, disabledEye, hiddenEye, onClickEye, newAccion1, newAccion2, newAccion3, newAccion4, ChangeLoading, nombreArchivoCSV, nombreArchivoExcel, hiddenExcel, hiddenCSV, hiddenDownload, ChildrenHeader, countPage, RenderChunk, hiddenSearch, onclickAccion1, onclickAccion2, onclickAccion3, onclickAccion4, RenderColumn, hiddenAccion4 = false, ViewPaginationsimpletable = false }: CrudTabletProps) => {
    const [chunk, setChunk] = useState<ChunkCrudTabletProps>(DefaultChunkCrudTablet(_InterPerPages));
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
                hiddenAccion4={hiddenAccion4}
            />
        )
    }, [])

    return (
        <div>
            <Card.Title as='h3'>{tittle}</Card.Title>
            {tablaCrud(data, NotViewData || [], chunk, disabled, disabledEdit, hiddenEdit, disabledDelete,
                hiddenDelete, disabledEye, hiddenEye, (e) => onClickEdit ? onClickEdit(e) : null,
                (e) => onClickDelete ? onClickDelete(e) : null, (e) => onClickEye ? onClickEye(e) : null,
                newAccion1, newAccion2, newAccion3, newAccion4, (e) => onclickAccion1 ? onclickAccion1(e) : null,
                (e) => onclickAccion2 ? onclickAccion2(e) : null, (e) => onclickAccion3 ? onclickAccion3(e) : null,
                (e) => onclickAccion4 ? onclickAccion4(e) : null, hiddenAccion4, RenderColumn, GridColumnGroupingModel,

            )}
            {countPage && (
                <div>
                    {(data.length > 0 && countPage !== undefined && countPage > _InterPerPages) && (
                        <div>
                            <PaginationBackend items={countPage ?? 0} itemPerPage={_InterPerPages} setChunk={(e) => RenderChunk && RenderChunk(e)} />
                        </div>
                    )}
                </div>)
            }

            {ViewPaginationsimpletable && <div>
                {(data.length >= _InterPerPages) && (
                    <div>
                        <PaginationCrudTablet items={data.length} itemPerPage={_InterPerPages} setChunk={setChunk} />
                    </div>
                )}
            </div>}
        </div>
    )
})

export default TablaSencilla 
