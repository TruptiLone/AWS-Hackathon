import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

const stats = [
  { value: 10000, suffix: '+', label: 'Students Tracked' },
  { value: 500, suffix: '+', label: 'Educational Institutions' },
  { value: 95, suffix: '%', label: 'Attendance Improvement' },
  { value: 4.9, suffix: '/5', label: 'User Rating', decimal: true },
]

function AnimatedCounter({ value, decimal }: { value: number; suffix: string; decimal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000 })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = decimal 
          ? latest.toFixed(1) 
          : Math.floor(latest).toLocaleString()
      }
    })
  }, [springValue, decimal])

  return <span ref={ref}>0</span>
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join the revolution in educational analytics
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center relative"
            >
              {/* Divider (except last item) */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 h-20 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              )}
              
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix}
                    decimal={stat.decimal}
                  />
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
