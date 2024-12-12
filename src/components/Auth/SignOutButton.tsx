import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';

const SignOutButton = () => {
  const auth = useAuth();
  return (
    <Button onClick={auth?.logOut} className='text-xl h-10'>
      <UserOutlined />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
