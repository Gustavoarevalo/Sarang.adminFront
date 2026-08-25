import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import faviconWhite from '../../public/images/logo-tienda-mark.svg';
import login from '../../public/images/logo-tienda-hero.svg';
import { useFillData } from '../Hooks/useFilldata';
import { ILogin, LoginDataDefualt } from '../api/Controller/Seguridad/auth/interfaceAuthController';
import { useAuth } from '../api/Controller/Seguridad/auth/authController';
import { getWebPushToken } from '../helper/webPushNotifications';
import { PushTokenStore } from '../store/PushTokenStore';
import { useRef } from 'react';

export default function SignIn() {
    const { data, updateData } = useFillData<ILogin>(LoginDataDefualt);
    const auth = useAuth();
    const { PushToken } = PushTokenStore();
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);


    const HandleLogin = async (e: React.FormEvent) => {
        updateData(true, 'validate')
        e.preventDefault();
        e.stopPropagation();
        updateData(true, 'loading');
        updateData(true, 'disabled');
        try {
            // SignAuth ya pidio el token al abrir el login; si aun no llego (o el
            // usuario recien acepto el permiso) se vuelve a pedir antes de enviar.
            const pushToken = PushToken.token ? PushToken : await getWebPushToken();

            await auth.setLogin({
                email: data.email,
                password: data.password,
                token: pushToken.token,
                dispositivo: pushToken.dispositivo,
                tipoToken: pushToken.tipoToken,
                plataforma: pushToken.plataforma,
            });
            updateData('', 'err');
            window.location.reload();
        } catch (err: any) {
            updateData(err.response.data.message || 'Error al iniciar sesión. Verifique sus credenciales.', 'err');
        } finally {
            updateData(false, 'loading');
            updateData(false, 'disabled');
        }
    };

    return (
        <>
            <Col>
                <Col className="main-container container-fluid">
                    <Row className="no-gutter">
                        <Col md={6} lg={6} xl={7} className="d-none d-md-flex bg-white-transparent">
                            <Row className="wd-75p mx-auto text-center mt-4">
                                <Col md={12} lg={12} xl={12} className="my-auto mx-auto wd-100p ">
                                    <img src={login} className="my-auto ht-xl-80p wd-md-100p wd-xl-80p mx-auto" alt="logo" />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={6} lg={6} xl={5} className="bg-white">
                            <Col className="login d-flex align-items-center ">
                                <Container className="p-0">
                                    <Row>
                                        <Col md={10} lg={10} xl={9} className="mx-auto">
                                            <Col className="card-sigin">
                                                <Col className="mb-5 d-flex ">
                                                    <img src={faviconWhite} loading='lazy' style={{ height: 50 }} alt="logo" />
                                                    <h1
                                                        className="main-logo1 ms-5 me-0 my-auto tx-38 text-nowrap text-center"
                                                        style={{ whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.2 }}
                                                    >
                                                        Administrador de Tienda
                                                    </h1>
                                                </Col>
                                                <Col className="card-sigin">
                                                    <Col className="main-signup-header">
                                                        <h2 style={{ color: "#4caf50" }}>Bienvenido!</h2>
                                                        <h5 className="fw-semibold mb-4">Por favor inicie sesión para continuar.</h5>
                                                        {data.err && <Alert variant="danger">{data.err}</Alert>}
                                                        <Form className="form-horizontal" noValidate onSubmit={HandleLogin} validated={data.validate} >
                                                            <Form.Group>
                                                                <Form.Control
                                                                    id="email"
                                                                    style={{ border: '2px solid #4caf50', borderRadius: '8px', boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)' }}
                                                                    className="mb-3"
                                                                    name="email"
                                                                    placeholder="Ingrese Correo"
                                                                    type="email"
                                                                    ref={emailRef}
                                                                    value={data.email}
                                                                    disabled={data.disabled}
                                                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateData(value.trim(), 'email')}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group className="position-relative">
                                                                <Form.Control
                                                                    className="mb-3 pe-5"
                                                                    style={{
                                                                        border: '2px solid #4caf50',
                                                                        borderRadius: '8px',
                                                                        boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)',
                                                                    }}
                                                                    placeholder="Ingrese Contraseña"
                                                                    name="password"
                                                                    ref={passwordRef}
                                                                    type={data.setShowPassword ? "text" : "password"}
                                                                    value={data.password}
                                                                    disabled={data.disabled}
                                                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                                                                        updateData(value.trim(), 'password')
                                                                    }
                                                                    required
                                                                />
                                                                <Button
                                                                    variant="link"
                                                                    type="button"
                                                                    onClick={() => updateData(!data.setShowPassword, 'setShowPassword')}
                                                                    className="position-absolute top-50 end-0 translate-middle-y me-2 p-1 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        backgroundColor: '#ffffff',
                                                                        border: '1px solid #ced4da',
                                                                        borderRadius: '50%',
                                                                        width: '30px',
                                                                        height: '30px',
                                                                        fontSize: "1.5rem",
                                                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                >
                                                                    <i className={`bi ${data.setShowPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                                </Button>
                                                            </Form.Group>
                                                            {/* <Col className="text-start mb-3">
                                                                <NavLink
                                                                    className="text-dark " to={'PoliticasPrivacidad'}>
                                                                    Ver política de <span className="text-decoration-underline text-primary">Tratamiento de Datos</span>
                                                                </NavLink>
                                                            </Col> */}
                                                            <Button className="btn-main-primary btn-block" style={{ color: "#fff", backgroundColor: "#4caf50", borderColor: "#4caf50" }} type="submit" disabled={data.disabled}>
                                                                Iniciar Sesion{data.loading && <span role="status" aria-hidden="true" className="spinner-border spinner-border-sm ms-2"></span>}
                                                            </Button>
                                                        </Form>
                                                        {/* <Col className="main-signin-footer mt-5">
                                                            <p>No tiene cuenta? <Link to={`${import.meta.env.BASE_URL}Authentication/SignUp`}>Crear Una Cuenta</Link></p>
                                                        </Col> */}
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </>
    )

}
