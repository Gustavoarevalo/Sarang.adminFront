import { ButtonGroup, Dropdown, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './Pageheader.module.scss';
import { startTour } from '../../../helper/tourGuide';
import { alertglobal } from '../../components/sweertAlert/sweertAlert';

const Pageheader = (props) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
  return (
    <div className={styles.Pageheader}>
      <div className="breadcrumb-header justify-content-between">
        <div className="my-auto">
          <div className="d-flex">
            <h4 className="content-title mb-4 my-auto">{props.active}</h4><span className="text-muted mt-1 tx-13 ms-2 mb-0">/ {props.active}</span>
          </div>
        </div>

        <div className="d-sm-flex">
          <div className="d-flex my-xl-auto right-content">
            <div className="pe-1 mb-xl-0">
              <Button onClick={() => startTour(props.active)} className="btn-icon me-2">
                <i className="bi bi-play-fill fs-4"></i>
              </Button>
            </div>
            <div className="pe-1 mb-xl-0">
              <Button variant='info' onClick={() => (typeof props.downloadExcel === "function" ? props.downloadExcel() : alertglobal("Info", "No hay descargable para esta tabla", "info"))}
                className="btn-icon me-2 btn-b buttonDownload"><i className="mdi mdi-filter-variant"></i></Button>
              {/* <OverlayTrigger
                placement="left"
                overlay={<Tooltip className="tooltip-primary">Descargar alumnos</Tooltip>}
              >
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="mb-1 border-0 bg-white shadow-sm"
                    style={{ padding: "3px", width: "45px"}}
                    bsPrefix="btn"
                  >
                    <i className="mdi mdi-filter-variant text-info fs-5"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      margin: "0px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {value.map((v) => (
                      <Dropdown.Item
                        key={v}
                        href="#"
                        onClick={() => handleDownload(v)}
                      >
                        <i className="bi bi-download text-info me-2"></i>
                        Descargar {v}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger> */}

            </div>
            <div className="pe-1 mb-xl-0">
              <Button variant='warning' onClick={() => location.reload()} className="btn-icon me-2 buttonReload"><i className="mdi mdi-refresh"></i></Button>
            </div>
          </div>
          <div className="mb-xl-0 right-content">
            <Dropdown as={ButtonGroup} placement="bottom-end" id="bg-vertical-dropdown-1">
              <Button variant="primary">{new Date().getDate()} {months[new Date().getMonth()]} {new Date().getFullYear()}</Button>
              <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
              <Dropdown.Menu style={{ margin: '0px' }} >
                <Dropdown.Item eventKey="1">2018</Dropdown.Item>
                <Dropdown.Item eventKey="2">2019</Dropdown.Item>
                <Dropdown.Item eventKey="1">2020</Dropdown.Item>
                <Dropdown.Item eventKey="2">2021</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

        </div>
      </div>
    </div>
  )
};


export default Pageheader;
