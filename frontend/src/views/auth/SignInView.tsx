import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';

function SignInView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <div
        style={{
          background: '#fff',
          width: '952px',
          height: '600px',
          padding: '32px',
          borderRadius: '8px',
        }}
      >
        <h2>Sign In Page</h2>
        <p>Sign in</p>
      </div>
    </ContentRow>
  );
}

export default SignInView;
