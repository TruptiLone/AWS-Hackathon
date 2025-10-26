import { motion } from 'framer-motion'
import { Clock, BarChart3, Brain, LayoutDashboard, TrendingUp, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const features = [
  {
    icon: Clock,
    title: 'Real-Time Attendance',
    description: 'Automated attendance tracking with QR codes and facial recognition. Mark attendance in seconds with 99.9% accuracy.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Engagement Analytics',
    description: 'Track student participation, questions asked, and interaction patterns. Get detailed insights into classroom dynamics.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Predictive analytics using machine learning to identify at-risk students and recommend interventions early.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Multi-Role Dashboards',
    description: 'Customized dashboards for teachers, students, and administrators. Each role gets relevant data and controls.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor academic progress with correlation between attendance, engagement, and grades. Visualize trends over time.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Real-time alerts for low attendance, engagement drops, and important updates. Stay connected with push notifications.',
    gradient: 'from-yellow-500 to-orange-500',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Modern Education
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your classroom into a data-driven learning environment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-2 hover:border-transparent relative overflow-hidden">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                <div className="absolute inset-[2px] bg-background rounded-lg z-0" />
                
                <CardHeader className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
