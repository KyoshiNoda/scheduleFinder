import { NavLink, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import Navbar from './Navbar';

type Props = {};
function PageLayout({}: Props) {
  const { userInfo } = useAppSelector((state) => state.auth);
  if (Object.keys(userInfo).length === 0) { // checks if userInfo is empty
    return (
      <div>
        <h1>Unauthorized</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }
  return (
    <>
      <Navbar user = {userInfo}/>
      <Outlet />
    </>
  );
}

export default PageLayout;
