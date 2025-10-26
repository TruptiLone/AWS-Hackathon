import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Target, Award } from 'lucide-react'

const teamMembers = [
  {
    name: 'Mohini Yadav',
    role: 'Founder',
    initials: 'MY',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Yang Tianbao',
    role: 'Chief Executive Officer',
    initials: 'YT',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Tarang Goyal',
    role: 'Chief Artificial Intelligence and Interface Officer',
    initials: 'TG',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Trupti Lone',
    role: 'Chief Technical Officer',
    initials: 'TL',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: 'Shreya Mahajan',
    role: 'Chief Operating Officer',
    initials: 'SM',
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Yichen Cheng',
    role: 'Chief Marketing Officer',
    initials: 'YC',
    color: 'from-emerald-500 to-emerald-600'
  }
]

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'mission' | 'values'>('team')

  const tabs = [
    { id: 'team' as const, label: 'Our Team', icon: Users },
    { id: 'mission' as const, label: 'Our Mission', icon: Target },
    { id: 'values' as const, label: 'Our Values', icon: Award },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground">
          Empowering education through data-driven insights
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-muted rounded-lg gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Meet the visionaries driving innovation in educational analytics
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="relative p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-card hover:border-primary/50">
                      <div className="flex flex-col items-center mb-4">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <span className="text-2xl font-bold text-white">{member.initials}</span>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                        <p className="text-sm text-muted-foreground text-center leading-relaxed">
                          {member.role}
                        </p>
                      </div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'mission' && (
            <motion.div
              key="mission"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground">
                    Empowering educators with intelligent insights to transform learning outcomes
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Main Mission Statement */}
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border">
                    <p className="text-lg leading-relaxed text-foreground">
                      At <span className="font-bold text-primary">Studentlytics</span>, we believe that every student deserves personalized attention and every educator deserves powerful tools to make data-driven decisions. Our mission is to bridge the gap between traditional teaching methods and modern technology by providing real-time analytics that illuminate student engagement, attendance patterns, and learning outcomes.
                    </p>
                  </div>

                  {/* Mission Pillars */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-xl bg-card">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Data-Driven Excellence</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We transform raw classroom data into actionable insights, enabling educators to identify at-risk students early and intervene effectively.
                      </p>
                    </div>

                    <div className="p-6 border rounded-xl bg-card">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Real-Time Intelligence</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our AI-powered platform provides instant feedback on student engagement, allowing teachers to adapt their approach in the moment.
                      </p>
                    </div>

                    <div className="p-6 border rounded-xl bg-card">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Student-Centric Approach</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Every feature we build prioritizes student success, privacy, and well-being while empowering educators with the tools they need.
                      </p>
                    </div>

                    <div className="p-6 border rounded-xl bg-card">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We're committed to making quality education analytics accessible to institutions worldwide, regardless of size or budget.
                      </p>
                    </div>
                  </div>

                  {/* Vision Statement */}
                  <div className="p-8 border rounded-2xl bg-card">
                    <h3 className="text-2xl font-bold mb-4 text-center">Our Vision for the Future</h3>
                    <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
                      We envision a world where every classroom is equipped with intelligent analytics that help educators unlock each student's full potential. Through continuous innovation and a deep commitment to educational excellence, we're building the future of learning—one insight at a time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'values' && (
            <motion.div
              key="values"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                  <p className="text-lg text-muted-foreground">
                    The principles that guide everything we do
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {/* Excellence */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="group"
                  >
                    <div className="relative p-8 border rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Excellence</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        We strive for excellence in every aspect of our platform, from the accuracy of our analytics to the intuitiveness of our user interface.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Continuous improvement and innovation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>High standards in product quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>Exceptional customer support</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>

                  {/* Integrity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="group"
                  >
                    <div className="relative p-8 border rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Integrity</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        We operate with transparency and honesty, protecting student data with the highest security standards and ethical practices.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Data privacy and security first</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Transparent pricing and policies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Ethical AI and analytics practices</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>

                  {/* Student Success */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group"
                  >
                    <div className="relative p-8 border rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Student Success</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Every decision we make is guided by one question: Will this help students learn better and achieve their full potential?
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Student-centered design philosophy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Empowering personalized learning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Measurable learning outcomes</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                {/* Additional Values */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Collaboration</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We believe in the power of collaboration between educators, students, and administrators to create meaningful change in education.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Innovation</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We embrace cutting-edge technology and creative solutions to solve complex educational challenges and stay ahead of evolving needs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Accessibility</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Quality education analytics should be available to all institutions, regardless of size, location, or budget constraints.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Empathy</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We understand the challenges educators face and design our solutions with compassion, support, and genuine care for their success.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  )
}
