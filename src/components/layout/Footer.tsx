'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { DSocialLink } from '@/types/dashboard.types';
import DynamicIcon from '../global/DynamicIcon';

interface FooterProps {
  userName?: string | null;
  socialLinks?: DSocialLink[];
}

export default function Footer({ userName, socialLinks = [] }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      /* Subframe spec: hairline top border, flat canvas — no elevation */
      className="border-t border-hairline bg-canvas"
    >
      <div className="container mx-auto max-w-page flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">

        {/* Copyright — Inter 500 14px pencil color */}
        <p className="text-[14px] font-medium tracking-[-0.07px] text-pencil">
          © {year}{' '}
          <span className="text-ink font-semibold">{userName}</span>.
          {' '}All rights reserved.
        </p>

        {/* Social Icons — grayscale, no color, float on canvas */}
        {socialLinks.length > 0 && (
          <motion.ul
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {socialLinks.map((social) => (
              <motion.li
                key={social.id}
                variants={{
                  hidden: { y: 8, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 250 } },
                }}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  /* Subframe: grayscale icons — pencil color, no background container,
                     hover gets card-surface fill + hairline border */
                  className="group flex items-center justify-center w-9 h-9 rounded-pills
                             text-pencil hover:text-ink border border-transparent
                             hover:border-hairline hover:bg-card-surface
                             transition-all duration-200"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  >
                    <DynamicIcon
                      iconName={social.iconName}
                      platform={social.iconPlatform}
                      className="w-4 h-4"
                    />
                    <span className="sr-only">{social.name}</span>
                  </motion.div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.footer>
  );
}

