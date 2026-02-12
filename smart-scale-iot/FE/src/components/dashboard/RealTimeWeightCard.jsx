import { ScaleStatus } from '../../constants/scaleConstants';
import { useMqttWeight } from '../../hooks/useMqttWeight';
import { convertWeightUnit, formatWeight } from '../../utils/weightHandlers';

export const RealTimeWeightCard = ({ 
  currentWeight, 
  status,
  unit,
  onUnitChange,
  onWeightReceived
}) => {
  // Custom hook để quản lý MQTT
  const { isRecording, mqttConnected, handleStartWeighing } = useMqttWeight(onWeightReceived);

  // Convert weight theo unit
  const displayWeight = convertWeightUnit(currentWeight, 'kg', unit);
  const isStable = status === ScaleStatus.STABLE;

  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <p className="text-gray-500 dark:text-[#9cb0ba] text-sm font-medium">Current Weight</p>
          <div className="flex items-baseline gap-3 my-2">
            <p className="text-gray-900 dark:text-white text-5xl font-bold tracking-tighter tabular-nums transition-all">
              {formatWeight(displayWeight)}
            </p>
            <p className="text-gray-500 dark:text-[#9cb0ba] text-2xl font-medium">{unit}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`size-2 rounded-full ${isStable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <p className={`${isStable ? 'text-green-500' : 'text-yellow-600'} text-sm font-medium`}>
              {status === ScaleStatus.STABLE ? 'Live' : status}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end justify-between gap-4">
          
          <div className="flex w-32">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#283339] p-1">
              <button 
                onClick={() => onUnitChange('kg')}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all ${unit === 'kg' ? 'bg-white dark:bg-[#111618] shadow-sm text-gray-800 dark:text-white' : 'text-gray-500 dark:text-[#9cb0ba]'}`}
              >
                kg
              </button>
              <button 
                onClick={() => onUnitChange('lbs')}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all ${unit === 'lbs' ? 'bg-white dark:bg-[#111618] shadow-sm text-gray-800 dark:text-white' : 'text-gray-500 dark:text-[#9cb0ba]'}`}
              >
                lbs
              </button>
            </div>
          </div>

          <button 
            onClick={handleStartWeighing}
            disabled={isRecording || !mqttConnected}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {!mqttConnected ? 'Connecting...' : isRecording ? 'Weighing...' : 'Start New Weight'}
          </button>
        </div>
      </div>
    </div>
  );
};
