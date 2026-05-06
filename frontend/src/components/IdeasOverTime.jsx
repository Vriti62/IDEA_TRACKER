import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function IdeasOverTimeChart({ data }) {
  return (
    <div className="chartCard">
      <div className="chartHeader">
        <h3>Ideas Over Time</h3>
        <span className="pill">This Month</span>
      </div>

      <div className="chartBody">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                color: "#e5e7eb",
              }}
              labelStyle={{ color: "#e5e7eb" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
