import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Route } from 'react-router-dom';
import AboutPage from './AboutPage';
import './App.css';
import { UserContext } from './context/UserContext';
import EventPage from './event/EventPage';
import FooterPage from './FooterPage';
import HeaderPage from './HeaderPage';
import HomePage from './HomePage';
import LoginPage from './login/LoginPage';
import MyPage from './my/MyPage';
import NoticePage from './notice/NoticePage';
import PboardPage from './pboard/PboardPage';


function App() {
  const [loginUser, setLoginUser] = useState({});

  return (
    <UserContext.Provider value={{ loginUser, setLoginUser }}>
      <div className="App">
        <HeaderPage />
        <Route path="/" element={HomePage}/>
        <Route path="/pboard" component={PboardPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/my" component={MyPage} />
        <Route path="/event" component={EventPage} />
        <Route path="/notice" component={NoticePage} />
        <FooterPage />
      </div>
    </UserContext.Provider>
  );
}

export default App;
