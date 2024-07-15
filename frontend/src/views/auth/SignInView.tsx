import { useState } from 'react';
import type { ReactElement } from 'react';

import { ContentRow } from '@Containers/content';
import {
  AuthForms,
  RecoveryForm,
  SignInForm,
  SignUpForm,
} from '@Containers/auth';

function SignInView(): ReactElement {
  const [formView, setFormView] = useState(AuthForms.SIGN_IN);
  return (
    <ContentRow margin="large">
      {formView === AuthForms.SIGN_IN && (
        <SignInForm changeForm={setFormView} />
      )}
      {formView === AuthForms.SIGN_UP && (
        <SignUpForm changeForm={setFormView} />
      )}
      {formView === AuthForms.RECOVERY && (
        <RecoveryForm changeForm={setFormView} />
      )}
    </ContentRow>
  );
}

export default SignInView;
