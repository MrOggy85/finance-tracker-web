import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import styles from './App.module.css';
import Home from './pages/Home';
import Future from './pages/Future';
import DailyCheckIn from './pages/DailyCheckIn';
import Account from './pages/Account';
import Login from './pages/Login';

type LinkItemProps = {
  url: string;
  text: string;
};

const LinkItem = ({ url, text }: LinkItemProps) => {
  return window.location.pathname === url ? (
    <p className={styles.active}>{text}</p>
  ) : (
    <Link
      className={`${styles.link} ${
        window.location.pathname === url ? 'active' : ''
      }`}
      to={url}
    >
      {text}
    </Link>
  );
};

function App() {
  const location = useLocation();
  return (
    <>
      <Nav variant="tabs">
        <NavItem>
          <LinkItem url="/" text="Home" />
        </NavItem>

        <NavItem>
          <LinkItem url="/account" text="Account" />
        </NavItem>
        <NavItem>
          <LinkItem url="/future" text="Future" />
        </NavItem>
        <NavItem>
          <LinkItem url="/login" text="Login" />
        </NavItem>
        <NavItem>
          <LinkItem url="/daily-check-in" text="Check-In" />
        </NavItem>
      </Nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Future visible={location.pathname === '/future'} />
      <DailyCheckIn visible={location.pathname === '/daily-check-in'} />
    </>
  );
}

export default App;
