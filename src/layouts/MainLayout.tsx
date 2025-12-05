import { Outlet } from 'react-router-dom';
import HomeHeader from '../components/common/HomeHeader';
import FooterSection from '../components/common/FooterSection';

const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
     <HomeHeader />
      <main className="main-content">
        <Outlet />
      </main>

    <FooterSection />
    </div>
  );
};

export default MainLayout;

