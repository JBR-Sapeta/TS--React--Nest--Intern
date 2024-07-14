import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';

function CompanyListingView(): ReactElement {
  return (
    <ContentRow margin="small">
      <div
        style={{
          background: '#fff',
          width: '952px',
          height: '600px',
          padding: '32px',
          borderRadius: '8px',
        }}
      >
        <h2>Companies Page</h2>
        <p>A list of companies</p>
      </div>
    </ContentRow>
  );
}

export default CompanyListingView;
