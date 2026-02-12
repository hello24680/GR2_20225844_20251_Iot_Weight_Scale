import { useNavigate } from 'react-router-dom';
import { ScaleStatus } from '../../constants/scaleConstants';

/**
 * Component hiển thị bảng lịch sử cân gần đây
 * Hiển thị ID, trọng lượng và trạng thái của mỗi lần cân
 * 
 * Props:
 * @param {Array<WeightRecord>} records - Mảng các bản ghi cân
 * @param {WeightUnit} unit - Đơn vị hiển thị ('kg' hoặc 'lbs')
 */
export const HistoryTable = ({ records, unit }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col h-full">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Weighing History</h3>
      
      {/* Table container với scrollbar */}
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-sm text-left">
          {/* Table header */}
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">ID</th>
              <th scope="col" className="px-4 py-3">Weight</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody>
            {records.map((record) => {
              // Chuyển đổi trọng lượng sang đơn vị hiển thị
              const displayWeight = unit === 'kg' ? record.weight : record.weight * 2.20462;
              const isStable = record.status === ScaleStatus.STABLE;
              
              return (
                <tr key={record.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {/* ID column - sử dụng font mono cho ID */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">#{record.id}</td>
                  
                  {/* Weight column - sử dụng tabular-nums để align số */}
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white tabular-nums">
                    {displayWeight.toFixed(2)} {unit}
                  </td>
                  
                  {/* Status column - badge với màu sắc theo trạng thái */}
                  <td className="px-4 py-3">
                    <span className={`${isStable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* View All button */}
      <button 
        onClick={() => navigate('/history')}
        className="mt-4 w-full text-center text-primary text-sm font-medium py-2 rounded-lg hover:bg-primary/10 transition-colors"
      >
        View All
      </button>
    </div>
  );
};
