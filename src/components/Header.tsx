"use client"

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import info from '../public/assets/info.png';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';

const Header = () => {

  const pathname = usePathname(); // obtains the current url

  // defines the class based in the url
  const headerClass = pathname == "/armarios" ? 'header header-lockers' : 
                      pathname == "/turmas" ? 'header header-classes' : 
                      'header';
 
  const [theme, setTheme] = useState("Claro");
  const cookies = new Cookies(null, { path : "/" });
  const router = useRouter();

  useEffect(() => {
    getTheme();
  }, []);

  const getTheme = () => {
    if(pathname == "/login") return;
    const cookieTheme = cookies.get("lockersSystem-theme");
    if(cookieTheme == "light"){
      document.body.className = "light-mode";
      setTheme("Claro");
    }
    else if(cookieTheme == "dark"){
      document.body.className = "dark-mode";
      setTheme("Escuro");
    }
    else{
      document.body.className = "light-mode";
    }
  }

  const changeTheme = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(theme == "Claro"){
      document.body.className = "dark-mode";
      setTheme("Escuro");
      cookies.set("lockersSystem-theme", "dark");
    }
    else{
      document.body.className = "light-mode";
      setTheme("Claro");
      cookies.set("lockersSystem-theme", "light");
    }
  }

  const logOut = () => {
    cookies.remove("lockersSystem-token");
    cookies.remove("lockersSystem-theme");
    router.push("/login");
  }

  return (
    pathname != "/login" ?
    <div className={headerClass}>
        <Image src={info} alt="header" style={{ height: "60px", width: "auto" }} />
        <div className="header-selection">
            <Link href="/armarios">
              <button className="selection-lockers">Armários</button>
            </Link>
            <Link href="/turmas">
              <button className="selection-classes">Turmas</button>
            </Link>
        </div>
        <div className="form-check form-switch">
          <div className="py-1">
            <label className="form-check-label color-main">{theme}</label>
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="flexSwitchCheckDefault"
              checked={theme === "Escuro"}
              style={{cursor: "pointer"}}
              onChange={changeTheme}
            />
          </div>
          <span 
            className="color-red" 
            style={{cursor: "pointer"}}
            onClick={logOut}
          >
            Sair
          </span>
        </div>
    </div>
    : <></>
  );
};

export default Header;
