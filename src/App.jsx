import { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import DashboardMain from "./components/DashboardMain";
import ModelAnalysis from "./components/ModelAnalysis";
import Pipeline from "./components/Pipeline";
import CallMap from "./components/CallMap";
import AlertsModule from "./components/AlertsModule";
import { useQuery } from '@tanstack/react-query';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // Quick fetch to get urgent leads for the topbar
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetch('/api/leads/alerts').then(res => res.json()),
    refetchInterval: 60000,
  });

  return (
    <div className="app-shell">
      <Topbar 
        urgentLeads={alerts.length} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="main-viewport">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content-area">
          {activeTab === 'Overview' && <DashboardMain />}
          {activeTab === 'Model Analysis' && <ModelAnalysis />}
          {activeTab === 'Pipeline' && <Pipeline />}
          {activeTab === 'Call Map' && <CallMap />}
          {activeTab === 'Alerts' && <AlertsModule />}
        </div>
      </div>
    </div>
  );
}

export default App;
