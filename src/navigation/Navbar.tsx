import { Divider } from 'antd';
import logo from '../assets/imaginate-logo.png'
import './Navbar.css'

const Navbar = () => {
  return (
    <div>
      <div className='flex '>
        <img className="h-10 mx-4 mt-6" src={logo} />
        {/* <div className='item inline-block rounded-full h-1/2 align-baseline mt-auto mb-auto ml-2'>
        <p className='nav-font'>Daily</p>
      </div>
      <div className='item inline-block rounded-full h-1/2 align-baseline mt-auto mb-auto ml-2'>
        <p className='nav-font'>+</p>
      </div> */}

      </div >
      <Divider />
    </div>
  );
};

export default Navbar