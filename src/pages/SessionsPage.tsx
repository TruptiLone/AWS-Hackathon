import { motion } from 'framer-motion'
import { Calendar, Clock, Video } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

const sessions = [
  {
    title: 'Data Science Workshop',
    date: 'Oct 28, 2025',
    time: '2:00 PM - 4:00 PM',
    type: 'Virtual',
    instructor: 'Dr. Sarah Johnson',
  },
  {
    title: 'Web Development Q&A',
    date: 'Oct 30, 2025',
    time: '10:00 AM - 11:30 AM',
    type: 'Virtual',
    instructor: 'Prof. Michael Chen',
  },
  {
    title: 'ML Study Group',
    date: 'Nov 2, 2025',
    time: '3:00 PM - 5:00 PM',
    type: 'In-Person',
    instructor: 'Dr. Emily Rodriguez',
  },
]

export default function SessionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Sessions</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Upcoming learning sessions and workshops
        </p>

        <div className="space-y-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
                      <CardDescription>Instructor: {session.instructor}</CardDescription>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {session.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{session.time}</span>
                    </div>
                    {session.type === 'Virtual' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Online Session</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm">Register Now</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
