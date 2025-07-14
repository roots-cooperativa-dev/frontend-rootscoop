
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}



const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 bg-background text-foreground">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;