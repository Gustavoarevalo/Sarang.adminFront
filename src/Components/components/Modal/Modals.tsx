import { Link } from "react-router-dom";
import Rodal from "rodal";

interface IModalPrincipal {
    open: boolean
    setOpen?: (e: boolean) => void
    tittle?: string
    subtittle?: string
    children: JSX.Element;
    height?: number
    width?: number
}

//prettier-ignore
export const ModalPrincipal: React.FC<IModalPrincipal> = ({ open, setOpen, tittle, subtittle, children, height = 280, width = 600 }) => {
    return (
        <>
            <Rodal
                onClose={() => (setOpen ? setOpen(false) : null)}
                visible={open}
                animation="door"
                height={height}
                width={width}
                customStyles={{
                    maxHeight: "90vh",
                    overflowY: "auto",
                    width: width ? `${width}px` : "auto",
                }}
            >
                <div className="modal-header d-flex justify-content-between align-items-center">
                    <div className="me-2 fw-bold">
                        {tittle ? tittle.toUpperCase() : ""}
                    </div>
                    <Link to="#" onClick={() => (setOpen ? setOpen(false) : null)}>
                        <span className="text-dark">
                            <i className="fe fe-x me-3"></i>
                        </span>
                    </Link>
                </div>

                <div className="modal-body">
                    {subtittle ? <h6>{subtittle}</h6> : <></>}
                    {children}
                </div>
            </Rodal>
        </>
    );
};
