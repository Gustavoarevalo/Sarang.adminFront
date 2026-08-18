import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => (
  <div className={styles.Footer}>
    <div className="main-footer">
      <div className="container-fluid pd-t-0 ht-100p">
        <span> Copyright © 2025 <Link to="#" className="text-primary">Cea Universal</Link>. Designed with <span className="fa fa-heart text-danger"></span> by <Link to="#"> DMA Technology </Link> All rights reserved.</span>
      </div>
    </div>
  </div>
);

export default Footer;
