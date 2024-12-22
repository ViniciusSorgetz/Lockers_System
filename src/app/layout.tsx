import "./styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from '@/components/Header';
import { ClassesWrapper } from "@/context/ClassesContext";
import { AuthWrapper } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="light-mode">
        <div className="content">
        <Header/>
            <AuthWrapper>
              <ClassesWrapper>
                {children}
              </ClassesWrapper>
            </AuthWrapper>
        </div>
      </body>
    </html>
  );
}
