import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, GraduationCap } from 'lucide-react'
import { Button } from './ui/button'

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
            >
              Education Analytics Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900"
            >
              Empower Learning Through{' '}
              <span className="text-blue-600">
                Data-Driven Insights
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl"
            >
              Track attendance, monitor student engagement, and improve academic outcomes with intelligent analytics designed for modern educators.
            </motion.p>

            {/* Portal Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-2"
            >
              <p className="text-sm font-semibold text-slate-700 mb-4">Choose Your Portal:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login?role=teacher" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Teacher Portal</div>
                      <div className="text-xs opacity-90">Manage all students</div>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login?role=student" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <GraduationCap className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Student Portal</div>
                      <div className="text-xs opacity-75">View your progress</div>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-6 pt-8 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">14-day free trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Classroom Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Classroom Image */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="/classroom-hero.png"
                alt="Engaged classroom with teacher and students"
                className="w-full h-auto object-cover"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-700 text-sm font-semibold">Live Session</span>
              </div>

              {/* Stats Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">28</div>
                    <div className="text-xs text-slate-600">Students</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-xs text-slate-600">Engaged</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  )
}
