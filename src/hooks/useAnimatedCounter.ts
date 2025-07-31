'use client';

import { useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function useAnimatedCounter(target: number) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const [val, setVal] = useState(0);

  useMotionValueEvent(spring, 'change', (v) => {
    setVal(Math.ceil(v));
  });

  useEffect(() => {
    mv.set(target);
  }, [mv, target]);

  return val;
}
