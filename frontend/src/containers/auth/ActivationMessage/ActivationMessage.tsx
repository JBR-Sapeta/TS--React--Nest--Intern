import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { BaseLink } from '@Components/shared';
import { useAccountActivation } from '@Data/auth';
import { extractBaseError } from '@Data/utils';
import { QUERY_PARAMS, ROUTER_PATHS } from '@Router/constants';

import styles from './ActivationMessage.module.css';

function ActivationMessage(): ReactElement {
  const { isPending, data, error, accountActivationMutation } =
    useAccountActivation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get(QUERY_PARAMS.ACTIVATION_TOKEN);

  useEffect(() => {
    if (token) {
      accountActivationMutation({ token });
    }
  }, [token, accountActivationMutation]);

  const errorData = extractBaseError(error);

  return (
    <section className={styles.section}>
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <g clipPath="url(#clip0_708_2445)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M512 256C512 397.385 397.385 512 256 512C114.615 512 0 397.385 0 256C0 114.615 114.615 0 256 0C276.82 0 297.059 2.48533 316.437 7.17549C388.189 36.7427 466.742 126.778 466.742 225.623C466.742 305.883 417.183 389.15 359.492 439.003C431.053 388.86 479.389 293.53 475.573 227.174C482.174 149.526 411.546 40.0853 316.719 7.24391C428.795 34.5053 512 135.536 512 256ZM186 267.667L232.667 314.333L326 221L309.55 204.433L232.667 281.317L202.45 251.217L186 267.667ZM151 174.333L256 127.667L361 174.333V244.333C361 309.083 316.2 369.633 256 384.333C195.8 369.633 151 309.083 151 244.333V174.333Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_708_2445">
            <rect width="512" height="512" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <h2>Aktywacja konta</h2>
      <p className={styles.p}>Zaloguj się i znajdź wymarzony staż !</p>
      {/* @ TO DO - add loading spinner */}
      {isPending && <p>trwa weryfikacja...</p>}
      {errorData && <p className={styles.error}>{errorData.message}</p>}
      {data && <p className={styles.success}>{data.message}</p>}
      <BaseLink
        path={ROUTER_PATHS.AUTH}
        size="medium"
        color="green"
        RightIcon={MdKeyboardArrowRight}
      >
        Zaloguj się
      </BaseLink>
    </section>
  );
}

export default ActivationMessage;
