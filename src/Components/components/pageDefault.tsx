import Pageheader from '../Layouts/Pageheader/Pageheader';
import { Button, Card, Col, Row } from 'react-bootstrap';
import ModalChangeLoading from './ModalChange';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface ChangeLoading {
    tittle?: string;
    active?: string;
    ChangeLoading?: boolean;
    childrenHeader?: React.ReactNode;
    childrenCardBody: React.ReactNode;
    hiddenRegresar?: boolean;
    tittleButton?: string
    hiddenButton?: boolean
    onclickButtonPrimary?: () => void
    disabled?: boolean
    downloadExcel?: () => void
}
const PageDefault: React.FC<ChangeLoading> = ({ ChangeLoading, childrenCardBody, tittle, active, childrenHeader, hiddenRegresar, tittleButton, disabled, hiddenButton, onclickButtonPrimary, downloadExcel }) => {
    const navigate = useNavigate();

    const handleRegresar = () => navigate(-1)

    return (
        <div >
            <ModalChangeLoading open={ChangeLoading != undefined ? ChangeLoading : false} />
            <Pageheader titles={tittle} active={active} downloadExcel={downloadExcel ? () => downloadExcel() : undefined} />
            <Row className="row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center" >
                            <Card.Title as='h3' className="mb-0">{tittle}</Card.Title>

                            <div className="d-flex" style={{ gap: '10px' }}>
                                {childrenHeader}

                                {(tittleButton || hiddenButton) && (
                                    <Button variant='primary' className="btnGlobal" disabled={disabled} onClick={() => onclickButtonPrimary && onclickButtonPrimary()}>
                                        {tittleButton}
                                    </Button>
                                )}

                                {!hiddenRegresar && (
                                    <Button variant='outline-primary' onClick={() => handleRegresar()} disabled={disabled}>
                                        Regresar
                                    </Button>
                                )}
                            </div>
                        </Card.Header>

                        <Card.Body>
                            {childrenCardBody}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PageDefault;