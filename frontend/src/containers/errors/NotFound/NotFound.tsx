import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { ROUTER_PATHS } from '@Router/constants';

import styles from './NotFound.module.css';

function NotFound(): ReactElement {
  return (
    <div className={styles.container}>
      <svg
        width="240"
        height="168"
        viewBox="0 0 240 168"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32.625 134V126.125L42.8125 124.375V113H1.9375V106.062L42.0625 43H55.0625V103.375H67.625V113H55.0625V124.375L65.25 126.125V134H32.625ZM15.0625 103.375H42.8125V60.5625L42.4375 60.4375L41.1875 63.75L15.0625 103.375ZM202.5 134V126.125L212.688 124.375V113H171.812V106.062L211.938 43H224.938V103.375H237.5V113H224.938V124.375L235.125 126.125V134H202.5ZM184.938 103.375H212.688V60.5625L212.312 60.4375L211.062 63.75L184.938 103.375Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M123 134C149.51 134 171 112.51 171 86C171 59.4903 149.51 38 123 38C120.866 38 118.764 38.1393 116.703 38.4094C116.615 38.3978 116.526 38.3863 116.438 38.375C116.498 38.3901 116.558 38.4053 116.618 38.4206C93.1254 41.5416 75 61.6541 75 86C75 112.51 96.4903 134 123 134ZM116.618 38.4206C165.089 50.7025 163.052 87.2488 150.092 104.986C150.095 104.851 150.097 104.716 150.097 104.581C150.097 96.029 143.165 89.0967 134.613 89.0967C126.062 89.0967 119.129 96.029 119.129 104.581C119.129 113.132 126.062 120.064 134.613 120.064C138.803 120.064 142.604 118.4 145.392 115.696C151.383 110.334 157.405 97.8163 158.812 92.6562C163.447 75.6616 156.609 43.65 116.703 38.4094C116.675 38.4131 116.646 38.4168 116.618 38.4206Z"
          fill="currentColor"
        />
      </svg>
      <h2>Ups, nic tu nie ma</h2>
      <p>Ta strona nie istnieje.</p>
      {/* @  TO DO - Use custom button */}
      <Link to={ROUTER_PATHS.OFFERS} className={styles.link}>
        Oferty
      </Link>
    </div>
  );
}

export default NotFound;
