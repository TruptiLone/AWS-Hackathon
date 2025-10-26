import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import StatsSection from '../components/StatsSection'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { BarChart3, Users, TrendingUp, Clock, Award, Target, MessageCircle, X } from 'lucide-react'

// FAQ Responses
const FAQ_RESPONSES: Record<string, string> = {
  'how does it work': '🎥 Studentlytics uses AI to automatically track attendance from classroom videos!\n\nHere\'s the process:\n1. Upload a classroom video to S3\n2. Our system detects and recognizes student faces\n3. We track engagement, speaking time, and attendance\n4. View results in real-time dashboards\n\nPowered by AWS Rekognition and Claude AI! 🤖',
  'pricing': '💰 Simple, transparent pricing:\n\n🆓 Free Tier: Up to 100 students, 10 hours of video per month\n⭐ Pro ($49/month): Up to 500 students, unlimited video processing\n🏢 Enterprise (Custom): Unlimited students, dedicated support\n\nTry free tier - no credit card required!',
  'features': '✨ Key Features:\n\n📊 Attendance Tracking: 95%+ accuracy\n🎯 Engagement Scoring: Head orientation analysis\n🗣️ Speaking Time: Participation analytics\n🤖 AI Analytics: Ask questions about your data\n📈 Real-time Dashboards: Live updates',
  'get started': '🚀 Getting Started is Easy!\n\n1️⃣ Sign Up: Create free account\n2️⃣ Upload Student Photos: JPG or PNG format\n3️⃣ Upload Classroom Video: MP4 format\n4️⃣ View Results: Check dashboard in 5-15 minutes\n\n📧 Need help? demo@studentlytics.com',
  'contact': '📞 Contact Us:\n\n📧 Email: support@studentlytics.com\n💬 Live Chat: Available 9 AM - 5 PM EST\n🌐 Website: studentlytics.com',
  'accurate': '🎯 Accuracy: 95%+ accurate\n• Face detection: 99%+ in good lighting\n• Face matching: 95%+ with quality photos\n\n💡 Depends on video quality, lighting, and clear student photos',
}

const quickQuestions = [
  '🎥 How does it work?',
  '💰 What are the pricing plans?',
  '✨ What features do you offer?',
  '🚀 How do I get started?',
  '🎯 How accurate is it?',
  '📧 How can I contact support?'
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// AI Chatbot for Teachers (connects to AWS API)
function TeacherAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hi! I\'m your AI assistant. Ask me about attendance, engagement, or student analytics!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = 'https://o35e0gmfl8.execute-api.us-east-1.amazonaws.com/prod/chat'

  const suggestions = [
    'How many students attended?',
    'Show engagement rankings',
    'Who was absent?',
    'What was the average attendance score?'
  ]

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = { role: 'user', content: input }
    const currentInput = input
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      console.log('=== CHATBOT DEBUG START ===')
      console.log('1. Sending message to API:', currentInput)
      console.log('2. API URL:', API_URL)
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput })
      })

      console.log('3. API Response status:', response.status)
      console.log('4. API Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('5. API Error response:', errorText)
        throw new Error(`API returned status ${response.status}: ${errorText}`)
      }

      const responseText = await response.text()
      console.log('6. Raw API Response:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('7. Parsed API Response:', data)
      } catch (parseError) {
        console.error('8. Failed to parse JSON:', parseError)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`)
      }
      
      // Handle different possible response formats
      let botResponse = ''
      
      if (data.response) {
        botResponse = data.response
        console.log('9. Using data.response')
      } else if (data.body) {
        console.log('10. Found data.body, parsing...')
        const bodyData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body
        botResponse = bodyData.response || bodyData.message || JSON.stringify(bodyData)
      } else if (data.message) {
        botResponse = data.message
        console.log('11. Using data.message')
      } else if (data.answer) {
        botResponse = data.answer
        console.log('12. Using data.answer')
      } else {
        console.log('13. No standard field found, using full data')
        botResponse = JSON.stringify(data, null, 2)
      }
      
      console.log('14. Final bot response:', botResponse)
      console.log('=== CHATBOT DEBUG END ===')
      
      const botMessage: Message = { role: 'assistant', content: botResponse }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('=== CHATBOT ERROR ===')
      console.error('Error details:', error)
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      console.error('=== ERROR END ===')
      
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n🔍 Check browser console (F12) for detailed logs.\n\nCommon issues:\n• CORS not enabled on API\n• Wrong API endpoint\n• API not deployed` 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[450px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">🤖 AI Analytics Assistant</h3>
            <p className="text-sm opacity-90">Ask me about your student data</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow border border-gray-100'}`}>
                  <p className="text-xs font-semibold mb-1 opacity-75">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow border border-gray-100">
                  <p className="text-sm text-gray-600">AI is thinking...</p>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                placeholder="Ask about attendance, engagement..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// FAQ Chatbot Component (for landing page)
function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hi! I can help answer common questions about Studentlytics. What would you like to know?' }
  ])
  const [input, setInput] = useState('')

  const findBestMatch = (query: string): string => {
    const q = query.toLowerCase()
    
    for (const [keywords, response] of Object.entries(FAQ_RESPONSES)) {
      if (q.includes(keywords)) {
        return response
      }
    }
    
    return `🤔 I'm not sure about that. Try asking about:\n\n${quickQuestions.slice(0, 4).map(q => `• ${q}`).join('\n')}\n\n📧 Or contact us: support@studentlytics.com`
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])

    const response = findBestMatch(input)
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    }, 500)

    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">Quick Help</h3>
            <p className="text-sm opacity-90">Ask me anything!</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow border border-gray-100'}`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.slice(0, 4).map((q, idx) => (
                  <button key={idx} onClick={() => setInput(q)} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-left">{q}</button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={sendMessage} disabled={!input.trim()} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('student')
  const [user, setUser] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState('all')
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated')
      const userData = localStorage.getItem('user')
      if (auth === 'true' && userData) {
        setIsAuthenticated(true)
        const parsed = JSON.parse(userData)
        setUser(parsed)
        setUserRole(parsed.type || 'student')
      }
    }

    checkAuth()

    // Listen for role changes
    const handleRoleChange = (e: any) => {
      setUserRole(e.detail)
    }

    window.addEventListener('roleChanged', handleRoleChange)
    return () => window.removeEventListener('roleChanged', handleRoleChange)
  }, [])

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <div>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <FAQChatbot />
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 px-8 py-16 md:px-16 md:py-20"
            >
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8"
                >
                  Ready to transform your school?
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Contact sales
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  // Teacher Dashboard
  if (userRole === 'teacher') {
    const classes = [
      {
        id: 'COEN233',
        name: 'Networking',
        code: 'COEN233',
        students: 52,
        attendance: 94,
        engagement: 89,
        schedule: 'MWF 10:00-11:00',
        room: 'ENGR205',
        topStudents: ['Katie Sharma', 'John Doe', 'Sarah Chen'],
        recentActivities: [
          'Quiz 3 completed - Avg: 87%',
          'Katie Sharma submitted assignment',
          'Class discussion: DHT Protocol'
        ]
      },
      {
        id: 'CS101',
        name: 'Data Structures',
        code: 'CS101',
        students: 48,
        attendance: 91,
        engagement: 85,
        schedule: 'TTh 2:00-3:30',
        room: 'CS Building 301',
        topStudents: ['Alex Johnson', 'Maria Garcia', 'David Lee'],
        recentActivities: [
          'Lab 5 submissions due today',
          'Midterm grades posted',
          'New assignment: Binary Trees'
        ]
      },
      {
        id: 'CS201',
        name: 'Algorithms',
        code: 'CS201',
        students: 56,
        attendance: 88,
        engagement: 92,
        schedule: 'MWF 1:00-2:00',
        room: 'CS Building 205',
        topStudents: ['Emily Wang', 'Michael Brown', 'Lisa Park'],
        recentActivities: [
          'Dynamic Programming lecture',
          'Assignment 4 graded',
          'Office hours: Friday 3-5pm'
        ]
      }
    ]

    const selectedClassData = selectedClass === 'all' ? null : classes.find(c => c.id === selectedClass)
    const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)
    const avgAttendance = Math.round(classes.reduce((sum, c) => sum + c.attendance, 0) / classes.length)
    const avgEngagement = Math.round(classes.reduce((sum, c) => sum + c.engagement, 0) / classes.length)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of your classes.</p>
          </motion.div>

          {/* Class Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Select Class/Course</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedClass('all')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedClass === 'all'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  All Classes
                </button>
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedClass === cls.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {cls.name} - {cls.code}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Overall Stats or Class-Specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                icon: Users, 
                label: 'Total Students', 
                value: selectedClassData ? selectedClassData.students : totalStudents, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50' 
              },
              { 
                icon: Clock, 
                label: 'Avg Attendance', 
                value: `${selectedClassData ? selectedClassData.attendance : avgAttendance}%`, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50' 
              },
              { 
                icon: TrendingUp, 
                label: 'Avg Engagement', 
                value: `${selectedClassData ? selectedClassData.engagement : avgEngagement}%`, 
                color: 'text-green-600', 
                bg: 'bg-green-50' 
              },
              { 
                icon: Award, 
                label: selectedClassData ? 'Top Students' : 'Total Classes', 
                value: selectedClassData ? selectedClassData.topStudents.length : classes.length, 
                color: 'text-amber-600', 
                bg: 'bg-amber-50' 
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-full`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Class Details */}
          {selectedClass === 'all' ? (
            // Show all classes
            <div className="space-y-6">
              {classes.map((cls, index) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{cls.name} - {cls.code}</h3>
                        <p className="text-sm text-muted-foreground">{cls.schedule} • {cls.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{cls.students}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                        <p className="text-2xl font-bold text-purple-600">{cls.attendance}%</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Engagement</p>
                        <p className="text-2xl font-bold text-green-600">{cls.engagement}%</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Top Performers</p>
                        <p className="text-2xl font-bold text-amber-600">{cls.topStudents.length}</p>
                      </div>
                    </div>

                    {expandedClass === cls.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-600" />
                              Top Performing Students
                            </h4>
                            <div className="space-y-2">
                              {cls.topStudents.map((student, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm">
                                    {i + 1}
                                  </div>
                                  <span>{student}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              Recent Activities
                            </h4>
                            <div className="space-y-2">
                              {cls.recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                  <span className="text-sm">{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
                      >
                        {expandedClass === cls.id ? 'Hide Details' : 'View Details'}
                      </Button>
                      <Link to={`/students?class=${cls.id}`} className="flex-1">
                        <Button className="w-full">
                          View All Students
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Show selected class details
            selectedClassData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedClassData.name} - {selectedClassData.code}</h2>
                      <p className="text-muted-foreground">{selectedClassData.schedule} • {selectedClassData.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-primary">{selectedClassData.students}</p>
                      <p className="text-sm text-muted-foreground">Students Enrolled</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        Top Performing Students
                      </h3>
                      <div className="space-y-3">
                        {selectedClassData.topStudents.map((student, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold">
                              {i + 1}
                            </div>
                            <span className="font-medium">{student}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Recent Activities
                      </h3>
                      <div className="space-y-3">
                        {selectedClassData.recentActivities.map((activity, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link to={`/students?class=${selectedClassData.id}`}>
                    <Button className="w-full" size="lg">
                      View All Students in {selectedClassData.code}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )
          )}
        </div>
        <TeacherAIChatbot />
      </div>
    )
  }

  // Student Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Track your progress and performance.</p>
        </motion.div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: 'My Engagement', value: '85%', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Clock, label: 'Attendance Rate', value: '92%', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Award, label: 'Current Grade', value: 'A-', color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Target, label: 'Assignments', value: '8/10', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-full`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* My Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              My Courses
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Networking - COEN233', grade: '92%', status: 'On Track' },
                { name: 'Data Structures - CS101', grade: '88%', status: 'Good' },
                { name: 'Algorithms - CS201', grade: '95%', status: 'Excellent' },
              ].map((course) => (
                <div key={course.name} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-sm font-semibold text-green-600">{course.grade}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: course.grade }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </h3>
            <div className="space-y-3">
              {[
                { task: 'Submit CS101 Assignment', due: 'Due Tomorrow', urgent: true },
                { task: 'Prepare for Networking Quiz', due: 'Due in 3 days', urgent: false },
                { task: 'Review Algorithms Notes', due: 'Due in 5 days', urgent: false },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${
                  item.urgent ? 'bg-red-50 border border-red-200' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.task}</span>
                    <span className={`text-xs ${
                      item.urgent ? 'text-red-600 font-semibold' : 'text-muted-foreground'
                    }`}>{item.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
