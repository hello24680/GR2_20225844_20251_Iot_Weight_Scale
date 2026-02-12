import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Biểu đồ trọng lượng theo thời gian
export const WeightChart = ({ data, unit }) => {
  const chartData = data.map(d => ({
    time: d.timestamp,
    value: unit === 'kg' ? d.weight : d.weight * 2.20462,
  }));


  const calculateChange = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1].value;
    const prev = chartData[chartData.length - 2].value;
    if (prev === 0) return 0;
    return ((current - prev) / prev) * 100;
  };

  
  const change = calculateChange();
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-full flex flex-col">
      {/* Header - Tiêu đề và thông tin thay đổi */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-1 flex-col gap-2 min-w-[288px]">
          <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Weight Fluctuation</p>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 dark:text-[#9cb0ba] text-sm font-normal leading-normal">Last Hour</p>
            <p className={`${isPositive ? 'text-green-500' : 'text-red-500'} text-sm font-medium leading-normal`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart - Biểu đồ */}
      <div className="flex-1 w-full min-h-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            {/* Gradient fill cho area */}
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9fe7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0d9fe7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Các axis ẩn để tự động scale */}
            <XAxis 
              dataKey="time" 
              hide={true} 
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            
            {/* Tooltip khi hover */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#111618', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={() => ''}
              formatter={(value) => [value.toFixed(2) + ' ' + unit, 'Weight']}
            />
            
            {/* Area chart với gradient */}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0d9fe7" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              animationDuration={500}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline labels - Nhãn thời gian */}
      <div className="flex justify-between mt-4">
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-60m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-50m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-40m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-30m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-20m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">-10m</p>
        <p className="text-gray-400 dark:text-[#9cb0ba] text-xs font-medium">Now</p>
      </div>
    </div>
  );
};
