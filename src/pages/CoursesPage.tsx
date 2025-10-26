import { motion } from 'framer-motion'
import { BookOpen, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const courses = [
  {
    title: 'Introduction to Data Science',
    description: 'Learn the fundamentals of data analysis and visualization',
    students: 45,
    duration: '12 weeks',
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Full-stack web development with modern technologies',
    students: 38,
    duration: '16 weeks',
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to ML algorithms and applications',
    students: 32,
    duration: '10 weeks',
  },
]

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Courses</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Explore our comprehensive course offerings
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
