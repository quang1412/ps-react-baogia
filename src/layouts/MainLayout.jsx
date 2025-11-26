import { Outlet, Link } from "react-router-dom";
import MainNavbar from "../components/Navbar";
import Container from 'react-bootstrap/Container';

const MainLayout = () => {
  return (
    <>
      <MainNavbar />
      
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  )
};

export default MainLayout;
