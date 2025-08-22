import { Card, CardContent } from "@/components/ui/card";
import { Bar, Pie, Line } from "recharts";
import { Users, Briefcase, Calendar, MessagesSquare, TrendingUp } from "lucide-react";

const AdminStats = () => {
  const stats = [
    { title: "Total Users", value: 1245, icon: <Users size={28} />, color: "bg-blue-500" },
    { title: "Job Postings", value: 320, icon: <Briefcase size={28} />, color: "bg-green-500" },
    { title: "Events Conducted", value: 45, icon: <Calendar size={28} />, color: "bg-purple-500" },
    { title: "Messages Exchanged", value: 890, icon: <MessagesSquare size={28} />, color: "bg-yellow-500" },
    { title: "Engagement Rate", value: "78%", icon: <TrendingUp size={28} />, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mt-12 border border-gray-300 rounded-2xl shadow-2xl bg-white/80">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg rounded-2xl border border-gray-200 bg-white/90 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-xl">
          <div className={`p-3 rounded-full text-white ${stat.color}`}>{stat.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        </Card>
      ))}
      
      {/* Chart Section */}
      <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white/90 p-4 col-span-full">
        <h3 className="text-lg font-semibold mb-4">User Engagement Over Time</h3>
        <LineChart width={300} height={200} data={[{ name: 'Jan', users: 400 }, { name: 'Feb', users: 800 }]}>
          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </Card>
    </div>
  );
};

export default AdminStats;
