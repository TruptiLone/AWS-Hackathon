import { motion } from 'framer-motion'
import { BarChart3, BookOpen, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const services = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics and reporting for student performance tracking',
  },
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Streamlined course creation, scheduling, and content management',
  },
  {
    icon: Users,
    title: 'Student Portal',
    description: 'Interactive student portal for assignments, grades, and communication',
  },
  {
    icon: TrendingUp,
    title: 'Performance Insights',
    description: 'AI-powered insights to improve learning outcomes and engagement',
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Comprehensive solutions for modern educational institutions
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-primary hover:underline font-medium">
                    Learn more →
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
