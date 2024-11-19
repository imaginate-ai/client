import { Divider, Flex, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import logo from '../../assets/imaginate-logo.png';
import './NavBar.css';
import { useAuth } from '../../providers/AuthProvider';
import AuthButton from '../Auth/AuthButton';

const THEME_EXPLAINER_TEXT = 'The theme changes every day!';

type NavBarProps = {
  theme: string | undefined;
};

const NavBar = ({ theme }: NavBarProps) => {
  const auth = useAuth();
  return (
    <div className='w-full px-4'>
      <Flex align='flex-end' justify='space-between' wrap>
        <img className='h-10 mt-6' src={logo} />
        <Flex align='center' justify='space-between' gap={'16px'}>
          <Tooltip title={THEME_EXPLAINER_TEXT} placement='bottomLeft'>
            {theme ? (
              <Flex>
                <InfoCircleOutlined className='mr-1' />
                <p className='mr-2'>Theme:</p>
                <p>{theme}</p>
              </Flex>
            ) : (
              ''
            )}
          </Tooltip>
          <AuthButton />
        </Flex>
      </Flex>
      <Divider />
    </div>
  );
};

export default NavBar;
