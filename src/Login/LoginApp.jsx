import React, { useState } from 'react';
import axios from 'axios';

import Session from './../EcoleDirecteAPI/Session.js';


function App() {
  if(localStorage.getItem("token") !== null && localStorage.getItem("account") !== null || sessionStorage.getItem("token") !== null && sessionStorage.getItem("account") !== null) {
    window.location.href = "/home";
  }

  const version = '0.1.0';

  const [visible, setVisible] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState(false);
  
  const handleUsernameFocus = () => setUsernameFocus(true);
  const handleUsernameBlur = () => setUsernameFocus(false);
  const handlePasswordFocus = () => setPasswordFocus(true);
  const handlePasswordBlur = () => setPasswordFocus(false);
  
  const handlePasswordVisibility = () => setVisible(!visible);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
        return setError("Veillez remplir tous les champs");
    } else {
      (async () => {
        try {
          const session  = new Session();
          const login  = await session.login(username, password);
            if(login.error) {
              setError(login.message);
            } else {
              console.log("good");
              if(remember) {
                localStorage.setItem("account", JSON.stringify(login.account));
                localStorage.setItem("token", login.token);
              } else {
                sessionStorage.setItem("account", JSON.stringify(login.account));
                sessionStorage.setItem("token", login.token);
              }
              window.location.href = "/home";
            }
        } catch (error) {
          console.error(error);
        }
    })();
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-2/3 bg-gradient-to-tr from-blue-800 to-purple-700 i hidden max-lg:w-1/2">
        <div className='mt-1/3 ml-10 mr-2 w-full h-full z-10' style={{marginTop: '30vh'}}>
          <h1 className="text-white font-bold text-4xl font-sans">EduDash</h1>
          <p className="text-white mt-1">Vous dashboard ED nouvelle génération !</p>
          <button className="block px-4 bg-white text-indigo-800 mt-4 py-2 rounded-xl font-bold mb-2"><a href='https://github.com/MartinKoscianski' target='_blank'>Voir sur github ➝</a></button>
        </div>
        <div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-white border-t-8"></div>
		      <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-white border-t-8"></div>
		      <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-white border-b-8 "></div>
		      <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-white border-b-8"></div>
        </div>
        <a href={'https://github.com/MartinKoscianski/EcoleDirecte/releases/tag/' + version} target='_blank' className="absolute bottom-3 right-6 text-white text-s">v{version}</a>
        <a href="#" target='_blank' className='absolute bottom-3 left-6 text-white hover:decoration-solid'>Mention Légal</a>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white h-full">
      <h1 className="absolute text-indigo-600 font-bold text-4xl font-sans top-12 center md:hidden">EduDash</h1>
        <form className="bg-white w-3/4 max-w-96 min-w-80" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Se connecter</h1>
          <p className="text-md font-normal text-gray-600 mb-7">Connectez-vous à votre compte EcoleDirecte</p>
          {error != false && 
            <div className='flex items-center border-2 py-2 px-3 rounded-xl mb-4 h-full bg-red-400 border-red-400'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="pl-2 outline-none border-none w-full text-white">{error}</p>
            </div>
          }
          <div className={usernameFocus ? "flex items-center border-2 py-2 px-3 rounded-xl mb-4 h-full border-gray-400" : "flex items-center border-2 py-2 px-3 rounded-xl mb-4 h-full border-gray-200"}>
            <svg xmlns="http://www.w3.org/2000/svg" className={usernameFocus ? "h-5 w-5 text-gray-500" : "h-5 w-5 text-gray-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <input 
              className="pl-2 outline-none border-none w-full" 
              type="username" 
              placeholder="Identifiant" 
              onFocus={handleUsernameFocus} 
              onBlur={handleUsernameBlur}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={passwordFocus ? "flex items-center border-2 py-2 px-3 rounded-xl mb-2 h-full border-gray-400" : "flex items-center border-2 py-2 px-3 rounded-xl mb-2 h-full border-gray-200"}>
            <svg xmlns="http://www.w3.org/2000/svg" className={passwordFocus ? "h-5 w-5 text-gray-500" : "h-5 w-5 text-gray-400"} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <input 
              className="pl-2 outline-none border-none w-full" 
              type={visible ? 'text' : 'password'} 
              placeholder="Mot de passe" 
              onFocus={handlePasswordFocus} 
              onBlur={handlePasswordBlur}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {visible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className={passwordFocus ? "h-5 w-5 text-gray-500 cursor-pointer" : "h-5 w-5 text-gray-400 cursor-pointer"} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" onClick={handlePasswordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg> 
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className={passwordFocus ? "h-5 w-5 text-gray-500 cursor-pointer" : "h-5 w-5 text-gray-400 cursor-pointer"} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" onClick={handlePasswordVisibility}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </div>
          <div className="flex items-center justify-between mx-1">
            <div className="flex items-center gap-x-0.5">
              <input 
                type="checkbox" 
                id="remember-me" 
                className="text-gray-600 cursor-pointer hover:bg"
                value={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="text-gray-600 ml-2" htmlFor="remember-me">Rester connecté</label>
            </div>
            <a href="https://api.ecoledirecte.com/mot-de-passe-oublie.awp" target="_blank" rel="noopener noreferrer" className="text-gray-600 ml-2 hover:text-blue-500 cursor-pointer">Mot de passe oublié ?</a>
          </div>
          <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-xl text-white font-semibold mb-2">Se connecter ➝</button>
        </form>
        <a href={'https://github.com/MartinKoscianski/EcoleDirecte/releases/tag/' + version} target='_blank' className="absolute bottom-3 right-6 md:hidden text-black text-s hover:decoration-solid">v{version}</a>
        <a href="#" target='_blank' className='absolute bottom-3 left-6 md:hidden text-black text-s hover:decoration-solid'>Mention Légal</a>
      </div>
    </div>
  );
}


async function checkLogin(username, password) {
  try {
      const response = await axios.post(
          "https://api.ecoledirecte.com/v3/login.awp",
          `data={"identifiant": "${username}", "motdepasse": "${password}"}`
      );

      return response.data.code !== 505;
  } catch (err) {
      console.error(err);
      return false;
  }
}

async function getTokenForAccount(username, password) {
  const session = new Session();
  try {
      const token = await session.loginAndGetToken(username, password);
      return token;
  } catch (error) {
      console.error(error);
      return null;
  }
}

export default App;
