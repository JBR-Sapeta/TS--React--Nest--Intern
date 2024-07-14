import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';

function OfferListingView(): ReactElement {
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
        <h2>Offers Page</h2>
        <p>A list of offers</p>
      </div>
    </ContentRow>
  );
}

export default OfferListingView;
