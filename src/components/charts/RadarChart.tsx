import {
  ResponsiveContainer,
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

interface RadarChartProps {
  data: Array<Record<string, any>>;
  keys: string[];
  nameKey: string;
  title?: string;
  height?: number;
}

const SERIES_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#f43f5e", "#06b6d4"];

export default function RadarChart({
  data,
  keys,
  nameKey,
  title,
  height = 300,
}: RadarChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ReRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <PolarRadiusAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
          />
          {keys.map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
              fill={SERIES_COLORS[index % SERIES_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
