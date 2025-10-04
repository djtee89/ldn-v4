import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface PriceSparklineProps {
  data?: number[];
  color?: string;
}

const PriceSparkline: React.FC<PriceSparklineProps> = ({ 
  data = [950, 965, 970, 985, 1000, 1020, 1015, 1030, 1045, 1060, 1075, 1080],
  color = 'hsl(var(--primary))' 
}) => {
  const chartData = data.map((value, index) => ({
    value,
    index,
  }));

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <YAxis domain={[minValue * 0.95, maxValue * 1.05]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceSparkline;
