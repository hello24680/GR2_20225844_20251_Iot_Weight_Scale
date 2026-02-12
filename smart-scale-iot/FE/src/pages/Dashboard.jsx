import { RealTimeWeightCard } from '../components/dashboard/RealTimeWeightCard';
import { WeightChart } from '../components/dashboard/WeightChart';
import { DeviceInfoCard } from '../components/dashboard/DeviceInfoCard';
import { HistoryTable } from '../components/dashboard/HistoryTable';

export const Dashboard = ({
  currentRecord,
  chartData,
  deviceInfo,
  history,
  unit,
  setUnit,
  onMqttWeightReceived
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
      {/* Left Column (2/3 width) - Cột bên trái chiếm 2/3 màn hình */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Real-time Weight Display - Widget hiển thị trọng lượng */}
        <RealTimeWeightCard
          currentWeight={currentRecord.weight}
          status={currentRecord.status}
          unit={unit}
          onUnitChange={setUnit}
          onWeightReceived={onMqttWeightReceived}
        />

        {/* Chart Section - Phần biểu đồ */}
        <div className="flex-1 min-h-125">
          <WeightChart data={chartData} unit={unit} />
        </div>
      </div>

      {/* Right Column (1/3 width) - Cột bên phải chiếm 1/3 màn hình */}
      <div className="lg:col-span-1 flex flex-col gap-6">

        {/* Device Info - Thông tin thiết bị */}
        <DeviceInfoCard info={deviceInfo} />

        {/* History Table Widget - Bảng lịch sử */}
        <div className="flex-1">
          <HistoryTable records={history.slice(0, 8)} unit={unit} />
        </div>
      </div>
    </div>
  );
};
