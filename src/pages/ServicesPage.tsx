import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, BookOpen, Users, TrendingUp, ChevronDown, Check, Video, Brain, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const services = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics and reporting for student performance tracking',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    details: {
      overview: 'Our Analytics Dashboard provides real-time insights into student performance, attendance, and engagement metrics. Powered by AI and machine learning, it transforms raw classroom data into actionable intelligence.',
      features: [
        'Real-time attendance tracking with 95%+ accuracy using facial recognition',
        'Engagement scoring based on head orientation and attention metrics',
        'Speaking time analysis and participation tracking',
        'Customizable reports and data export (CSV, PDF, Excel)',
        'Historical trend analysis and predictive analytics',
        'Multi-class comparison and benchmarking'
      ],
      insights: [
        '📊 Track attendance patterns and identify at-risk students early',
        '🎯 Monitor engagement levels across different courses and sessions',
        '📈 95%+ accuracy in face detection and matching with quality videos',
        '⏱️ Process 1-hour videos in just 15-20 minutes'
      ],
      useCases: [
        'Identify students who need additional support',
        'Measure effectiveness of teaching methods',
        'Generate automated attendance reports',
        'Track engagement trends over time'
      ]
    }
  },
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Streamlined course creation, scheduling, and content management',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    details: {
      overview: 'Simplify your course administration with our intuitive Course Management system. Create, organize, and manage multiple courses with ease while maintaining complete control over schedules, content, and student enrollment.',
      features: [
        'Multi-course and multi-session management',
        'Automated class scheduling and calendar integration',
        'Student enrollment and roster management',
        'Course-specific analytics and performance tracking',
        'Content organization and resource sharing',
        'Bulk operations for efficient administration'
      ],
      insights: [
        '📚 Manage unlimited courses and sessions from one dashboard',
        '📅 Automated scheduling reduces administrative overhead by 60%',
        '👥 Track up to 500 students per course on Pro plan',
        '🔄 Seamless integration with existing LMS systems'
      ],
      useCases: [
        'Organize courses by semester or term',
        'Track student progress across multiple classes',
        'Generate course-specific performance reports',
        'Manage teaching assistants and co-instructors'
      ]
    }
  },
  {
    icon: Users,
    title: 'Student Portal',
    description: 'Interactive student portal for assignments, grades, and communication',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    details: {
      overview: 'Empower students with a personalized portal where they can track their own progress, view attendance records, and monitor engagement metrics. Foster transparency and encourage self-improvement.',
      features: [
        'Personal dashboard with attendance and engagement history',
        'Real-time grade and performance updates',
        'Individual progress tracking and goal setting',
        'Secure authentication with Google Sign-In',
        'Mobile-responsive design for on-the-go access',
        'Privacy-focused with FERPA and GDPR compliance'
      ],
      insights: [
        '🎯 Students can view their own engagement scores and trends',
        '📊 Self-awareness leads to 25% improvement in participation',
        '🔒 Bank-level encryption ensures data security',
        '📱 Access from any device - desktop, tablet, or mobile'
      ],
      useCases: [
        'Students monitor their attendance patterns',
        'Track personal engagement improvements',
        'Compare performance across different courses',
        'Set and achieve academic goals'
      ]
    }
  },
  {
    icon: TrendingUp,
    title: 'Performance Insights',
    description: 'AI-powered insights to improve learning outcomes and engagement',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    details: {
      overview: 'Leverage the power of Claude AI to gain deep insights into your classroom dynamics. Our AI chatbot answers complex questions about student data in natural language, making analytics accessible to everyone.',
      features: [
        'Natural language queries - ask questions in plain English',
        'Intelligent data analysis powered by Claude AI',
        'Predictive analytics for early intervention',
        'Automated insights and recommendations',
        'Comparative analysis across students and classes',
        'Trend detection and anomaly alerts'
      ],
      insights: [
        '🤖 Ask: "Who was absent yesterday?" - Get instant answers',
        '💡 AI identifies patterns humans might miss',
        '📊 Predictive models forecast student performance',
        '⚡ Instant insights without manual data analysis'
      ],
      useCases: [
        'Identify top performers and struggling students',
        'Discover engagement patterns by time of day',
        'Compare teaching effectiveness across sections',
        'Get recommendations for intervention strategies'
      ]
    }
  },
]

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const toggleService = (title: string) => {
    setExpandedService(expandedService === title ? null : title)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI-powered solutions for modern educational institutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
                <CardHeader>
                  <div className={`${service.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button 
                    onClick={() => toggleService(service.title)}
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Learn more 
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedService === service.title ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedService === service.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-6"
                      >
                        {/* Overview */}
                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Overview
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {service.details.overview}
                          </p>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-600" />
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {service.details.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Insights */}
                        <div className={`${service.bgColor} p-4 rounded-lg`}>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <TrendingUp className={`h-5 w-5 ${service.color}`} />
                            Key Insights
                          </h4>
                          <ul className="space-y-2">
                            {service.details.insights.map((insight, idx) => (
                              <li key={idx} className="text-sm font-medium">
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Use Cases
                          </h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {service.details.useCases.map((useCase, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary font-bold">•</span>
                                <span>{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Classroom?</h3>
              <p className="text-lg mb-6 opacity-90">
                Start your free trial today - no credit card required
              </p>
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started Free
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
