"use client"

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import cimol from '../public/assets/cimol.png';
import info from '../public/assets/info.png';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname(); // Obtém o caminho atual

  // Define a classe com base no pathname
  const headerClass = pathname === '/armarios' ? 'header header-armarios' : 
                      pathname === '/turmas' ? 'header header-turmas' : 
                      'header';

  return (
    <div className={headerClass}>
        <Image src={cimol} alt="header" style={{ height: "90px", width: "auto" }} />
        <div className="header-selection">
            <Link href="/armarios">
              <button className="selection-armarios">Armários</button>
            </Link>
            <Link href="/turmas">
              <button className="selection-turmas">Turmas</button>
            </Link>
        </div>
        <Image src={info} alt="header" style={{ height: "60px", width: "auto" }} />
    </div>
  );
};

export default Header;
