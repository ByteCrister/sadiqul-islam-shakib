'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { userName } from '@/utils/parameter.global';
import { socials } from '@/utils/parameter.footer';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-t border-neutral-200 dark:border-neutral-700"
    >
      <div className="container mx-auto flex flex-col items-center justify-center h-20 px-4">
        {/* COPYRIGHT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm text-neutral-600 dark:text-neutral-400"
        >
          © {year} {userName}. All rights reserved.
        </motion.p>

        {/* SOCIAL ICONS */}
        <motion.ul
          className="flex items-center space-x-6 mt-4 md:mt-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {socials.map(({ href, Icon, label }) => (
            <motion.li
              key={label}
              className="group"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{label}</span>
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.footer>
  );
}
