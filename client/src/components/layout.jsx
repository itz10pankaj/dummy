import Header from "./Header";
import Footer from "./Footer";
const Layout = ({ children ,initialUser}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header initialUser={initialUser}/>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
