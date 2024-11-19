import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';

const LoginButton = () => {
  const auth = useAuth();
  return (
    <Button onClick={auth?.loginRedirect} className='text-xl h-10'>
      <GoogleOutlined />
      Login
    </Button>
  );
};

export default LoginButton;
