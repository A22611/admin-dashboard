interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any; 
  description?: string;
}

export default function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Icon className="h-5 w-5 text-purple-500" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white">{value}</span>
        {description && (
          <span className="text-xs text-slate-500 mt-1">{description}</span>
        )}
      </div>
    </div>
  );
}