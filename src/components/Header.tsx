"use client"

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import cimol from '../public/assets/cimol.png';
import info from '../public/assets/info.png';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname(); // obtains the current url

  // defines the class based in the url
  const headerClass = pathname.includes("armarios") ? 'header header-lockers' : 
                      pathname.includes("turmas") ? 'header header-classes' : 
                      'header';
 
  return (
    <div className={headerClass}>
        <Image src={cimol} alt="header" style={{ height: "90px", width: "auto" }} />
        <div className="header-selection">
            <Link href="/armarios">
              <button className="selection-lockers">Armários</button>
            </Link>
            <Link href="/turmas">
              <button className="selection-classes">Turmas</button>
            </Link>
        </div>
        <Image src={info} alt="header" style={{ height: "60px", width: "auto" }} />
    </div>
  );
};

export default Header;
