"use client";

import { motion, Variants } from "framer-motion";

interface TextEffectProps {
  text: string;
  className?: string;
}

export default function TextEffect({ text, className }: TextEffectProps) {
  const letter = text.split("");

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 18,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
    >
      {letter.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block whitespace-pre"
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
