import { Divider, Flex, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import logo from '../../assets/imaginate-logo.png';
import './NavBar.css';

const THEME_EXPLAINER_TEXT = 'The theme changes every day!';

type NavBarProps = {
  theme: string | undefined;
};

const NavBar = ({ theme }: NavBarProps) => {
  return (
    <div className='w-full'>
      <Flex align='flex-end' justify='space-between' wrap>
        <img className='h-10 mx-4 mt-6' src={logo} />
        <div className='mx-4 mt-4'>
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
        </div>
      </Flex>
      <Divider />
    </div>
  );
};

export default NavBar;
