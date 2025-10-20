"use client"
import { AnimatePresence, motion } from 'framer-motion'

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.main
        layoutId="dashboard-root"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}


