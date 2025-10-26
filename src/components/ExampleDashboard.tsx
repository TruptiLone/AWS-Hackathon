import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

// Sample data for the chart
const data = [
  { name: 'Jan', students: 400 },
  { name: 'Feb', students: 300 },
  { name: 'Mar', students: 600 },
  { name: 'Apr', students: 800 },
  { name: 'May', students: 700 },
  { name: 'Jun', students: 900 },
]

const stats = [
  {
    title: 'Total Students',
    value: '2,543',
    change: '+12.5%',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Active Courses',
    value: '48',
    change: '+3.2%',
    icon: BookOpen,
    color: 'text-green-600',
  },
  {
    title: 'Completion Rate',
    value: '87%',
    change: '+5.1%',
    icon: Award,
    color: 'text-purple-600',
  },
  {
    title: 'Growth',
    value: '23%',
    change: '+8.3%',
    icon: TrendingUp,
    color: 'text-orange-600',
  },
]

export default function ExampleDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
            <CardDescription>
              Monthly student enrollment over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex gap-4"
      >
        <Button>View Details</Button>
        <Button variant="outline">Export Data</Button>
      </motion.div>
    </div>
  )
}
