import type { ReactElement } from 'react';

import { InternalServerError } from '@Containers/errors';

function InternalServerErrorView(): ReactElement {
  return <InternalServerError />;
}

export default InternalServerErrorView;
