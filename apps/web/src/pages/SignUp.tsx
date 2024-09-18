import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SignUp />
    </div>
  );
};

export default SignUpPage;
