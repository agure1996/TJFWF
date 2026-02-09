import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className: string }>;
  color: "indigo" | "amber" | "emerald" | "rose";
  trend?: string;
};

export default function StatsCard(children: Readonly<Props>) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{children.title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {children.value}
          </p>
          {children.trend && (
            <p className="text-xs text-emerald-600 font-medium mt-2">
              {children.trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[children.color] || colorMap.indigo}`}>
          <children.icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
