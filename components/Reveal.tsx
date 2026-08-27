'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
export default function Reveal({ children, className='' }: { children: ReactNode; className?: string }) { return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>; }
