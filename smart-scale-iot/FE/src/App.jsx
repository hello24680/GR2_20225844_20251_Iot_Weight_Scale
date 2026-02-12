import { useEffect ,useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Sidebar } from './components/Sidebar';
import { weightService } from './services/weightService';
import { deviceService } from './services/deviceService';
import { ScaleStatus } from './constants/scaleConstants';
import { transformMqttWeightData } from './utils/weightHandlers';

function App() {
  // State cho MQTT current weight (real-time from ESP32)
  const [mqttCurrentWeight, setMqttCurrentWeight] = useState({
    id: 'init',
    weight: 0,
    status: ScaleStatus.STABLE,
    timestamp: 0
  });

  // State cho history records (from BE)
  const [history, setHistory] = useState([]);
  
  // State cho chart data (from BE history)
  const [chartData, setChartData] = useState([]);

  // State cho device information (from BE)
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: '',
    name: '',
    status: 'Offline',
    lastSync: 0,
    caliFactor: 0,
    offset: 0
  });

  // State cho unit selection (kg or lbs)
  const [unit, setUnit] = useState('kg');

  // Constants
  const MAX_CHART_POINTS = 50;

  // Handler for MQTT weight updates (ESP32 real-time data)
  const handleMqttWeightReceived = (data) => {
    console.log('[App] MQTT weight received from ESP32:', data);
    
    const record = transformMqttWeightData(data);
    setMqttCurrentWeight(record);
  };

  // Function to reload data (can be called after delete)
  const loadData = async () => {
    try {
      // Load history data from BE
      const historyData = await weightService.getHistory();
      console.log('[App] Loaded history from BE:', historyData.length, 'records');
      setHistory(historyData);
      
      // Set chart data (reverse for chronological order)
      if (historyData.length > 0) {
        setChartData(historyData.slice(0, MAX_CHART_POINTS).reverse());
      }

      // Load device info from BE
      const deviceData = await deviceService.getInfo();
      console.log('[App] Loaded device info from BE:', deviceData);
      setDeviceInfo(deviceData);
    } catch (error) {
      console.error('[App] Error loading data from BE:', error);
    }
  };

  // Load initial data from BE on mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen w-full flex-col bg-gray-50 dark:bg-[#0e1214]">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto">
              <AppRoutes
                currentRecord={mqttCurrentWeight}
                chartData={chartData}
                deviceInfo={deviceInfo}
                history={history}
                unit={unit}
                setUnit={setUnit}
                onMqttWeightReceived={handleMqttWeightReceived}
                onDataChange={loadData}
              />
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
