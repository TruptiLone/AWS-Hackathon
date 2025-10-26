import { motion } from 'framer-motion'
import { Calendar, Users, BarChart3, Activity, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const topStats = [
  { title: "Today's Sessions", value: '12', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Active Students', value: '342', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Average Attendance', value: '87%', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Engagement Score', value: '8.4/10', icon: Activity, color: 'text-orange-600', bgColor: 'bg-orange-100' },
]

const liveSessions = [
  {
    class: 'Mathematics 101',
    subject: 'Calculus',
    teacher: 'Dr. Sarah Johnson',
    students: 28,
    engagement: 85,
  },
  {
    class: 'Physics 202',
    subject: 'Quantum Mechanics',
    teacher: 'Prof. Michael Chen',
    students: 24,
    engagement: 92,
  },
  {
    class: 'Computer Science 301',
    subject: 'Data Structures',
    teacher: 'Dr. Emily Rodriguez',
    students: 35,
    engagement: 78,
  },
]

const attendanceData = [
  { day: 'Mon', attendance: 85 },
  { day: 'Tue', attendance: 88 },
  { day: 'Wed', attendance: 82 },
  { day: 'Thu', attendance: 90 },
  { day: 'Fri', attendance: 87 },
  { day: 'Sat', attendance: 75 },
  { day: 'Sun', attendance: 70 },
]

const recentActivities = [
  { event: 'Student joined', detail: 'John Doe joined Math 101', time: '2 mins ago' },
  { event: 'Question asked', detail: 'Sarah asked about derivatives', time: '5 mins ago' },
  { event: 'Assignment submitted', detail: 'Physics homework by Mike', time: '10 mins ago' },
  { event: 'Student joined', detail: 'Emma joined CS 301', time: '15 mins ago' },
  { event: 'Question asked', detail: 'Tom asked about algorithms', time: '20 mins ago' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sessions Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all your classroom sessions</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {topStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  Live Sessions
                </CardTitle>
                <CardDescription>Currently active classroom sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveSessions.map((session, index) => (
                  <motion.div
                    key={session.class}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{session.class}</h3>
                        <p className="text-sm text-muted-foreground">{session.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{session.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{session.teacher}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2 w-24">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${session.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{session.engagement}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">Join Session</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>Last 7 days attendance trends</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Daily</Button>
                    <Button size="sm" variant="ghost">Weekly</Button>
                    <Button size="sm" variant="ghost">Monthly</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.detail}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
