import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SignIn />
    </div>
  );
};

export default SignInPage;
