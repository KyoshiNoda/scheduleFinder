import { useState, useEffect } from 'react';
import LoginBox from '../components/Login/LoginBox';
import hero2 from '../assets/plsWork.png';
import Toggle from '../components/Toggle';

const LoginPage = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-full w-screen flex-col gap-10 bg-gray-50 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end ">
        <Toggle />
      </div>
      <div className="flex items-center justify-center 2xl:justify-center">
        <div className="h-min-h-full flex w-full items-center justify-center md:w-3/5">
          <LoginBox />
        </div>
        {width >= 768 && (
          <div className="flex h-full items-center p-3">
            <img src={hero2} className="h-96" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
