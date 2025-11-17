import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_Hk1iUXIym',
      userPoolClientId: '3cdfnuv8j649iba11h5ik7rv35',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
};

export function configureAmplify() {
  Amplify.configure(amplifyConfig);
}

export default amplifyConfig;
