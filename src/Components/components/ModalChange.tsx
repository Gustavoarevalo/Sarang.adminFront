import { Spinner } from 'react-bootstrap';

interface IModalModalChangeLoadingProps {
    open: boolean;
}

const ModalChangeLoading = ({ open }: IModalModalChangeLoadingProps) => {
    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.spinnerContainer}>
                <Spinner animation="grow" variant='primary' role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // backgroundColor: 'rgba(0, 0, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2147483647,
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export default ModalChangeLoading;


