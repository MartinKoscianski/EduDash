import React, { useState, useEffect } from 'react';
import Student from './../../EcoleDirecteAPI/Student';
import DashboardApp from './../DashboardApp';

function HomeApp() {
  const [token, setToken] = useState("");
  const [account, setAccount] = useState("");
  const [student, setStudent] = useState(null);

  const verifyConect = async () => {
    if (localStorage.getItem("token") !== null && localStorage.getItem("account") !== null) {
      setToken(localStorage.getItem("token"));
      setAccount(JSON.parse(localStorage.getItem("account")));
    } else if (sessionStorage.getItem("token") !== null && sessionStorage.getItem("account") !== null) {
      setToken(sessionStorage.getItem("token"));
      setAccount(JSON.parse(sessionStorage.getItem("account")));
    } else {
      window.location.href = "/";
    }
  };

  const disconect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("account");
    window.location.href = "/";
  }

  
  const getHomeInformation = async () => {
    const student = new Student(account, token);
    setStudent(student);
  }

  useEffect(() => {
    verifyConect();
    getHomeInformation();
  }, []);
  


  return (
    <>
      <DashboardApp/>
      <button onClick={disconect}>Déconnexion</button>
    </>
  );
}

export default HomeApp;
