import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navLists } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className='w-full py-5 sm:px-10 px-5 flex justify-between items-center'>
        {/* <img src={logo} alt="Logo" width={120} height={50} className='ml-4'/> */}
        <nav className='flex w-full screen-max-width'>
            <div className='flex flex-1 justify-center max-sm:hidden'>
                {navLists.map((nav, index) => (
                    <div
                      key={index}
                      className='px-5 text-sm cursor-pointer text-gray hover:text-white transition-all'
                      onClick={() => handleNavigation(`/${nav.replace(/\s+/g, '-').toLowerCase()}`)}
                    >
                        {nav}
                    </div>
                ))}
            </div>
        </nav>
    </header>
  );
}

export default Navbar;
