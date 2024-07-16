import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import { PostRegistrationMessage } from '@Containers/auth';

function PostRegistrationView(): ReactElement {
  return (
    <ContentRow margin="medium">
      <PostRegistrationMessage />
    </ContentRow>
  );
}

export default PostRegistrationView;
