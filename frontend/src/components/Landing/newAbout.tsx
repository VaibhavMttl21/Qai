

import { MotionValue, useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";
import { IconType } from "react-icons";
import {
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiCopy,
  FiDatabase,
} from "react-icons/fi";

export const StickyCards = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <div ref={ref} className="relative">
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
      {/* <div className="h-screen bg-black" /> */}
    </>
  );
};

interface CardProps {
  position: number;
  card: CardType;
  scrollYProgress: MotionValue;
}

const Card = ({ position, card, scrollYProgress }: CardProps) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  const isOddCard = position % 2;

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: position === CARDS.length ? undefined : y,
        background: isOddCard ? "#e3e3e3" : "white",
        color: isOddCard ? "black" : "black",
      }}
      {...{className:"sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4"}}
    >
      <card.Icon className="mb-4 text-4xl" />
      <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
        {card.title}
      </h3>
      <p className="mb-8 max-w-lg text-center text-sm md:text-base">
        {card.description}
      </p>
      <a
        href={card.routeTo}
        className={`flex items-center gap-2 rounded px-6 py-4 text-base font-medium uppercase text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
          card.ctaClasses
        } ${
          isOddCard
            ? "shadow-[4px_4px_0px_white] hover:shadow-[8px_8px_0px_white]"
            : "shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black]"
        }`}
      >
        <span>Learn more</span>
        <FiArrowRight />
      </a>
    </motion.div>
  );
};

const CARD_HEIGHT = 500;

type CardType = {
  id: number;
  Icon: IconType;
  title: string;
  description: string;
  ctaClasses: string;
  routeTo: string;
};

const CARDS: CardType[] = [
  {
    id: 1,
    Icon: FiCalendar,
    title: "About Us",
    description:
      "QAI makes Artificial Intelligence simple, fun, and practical for students from Class 6 to 12. Our course is built to prepare young minds for tomorrow’s world — through interactive lessons, real-world examples, and smart study strategies",
    ctaClasses: "bg-violet-300",
    routeTo: "#",
  },
  {
    id: 2,
    Icon: FiDatabase,
    title: "Our Mission",
    description:
      "AI education should be integrated into every classroom to equip students with modern learning tools. Simplifying AI through engaging, age-appropriate lessons will help schools deliver essential future-ready skills.",
    ctaClasses: "bg-pink-300",
    routeTo: "#",
  },
  {
    id: 3,
    Icon: FiCopy,
    title: "Join Us",
    description:
      "This course is ideal for students from Classes 6 to 12 who are eager to understand how AI works, enhance their study methods using modern tools, explore emerging career opportunities, and learn through fun and easy-to-understand lessons.",
    ctaClasses: "bg-red-300",
    routeTo: "#",
  },
  {
    id: 4,
    Icon: FiAward,
    title: "Why choose QAI",
    description:
      "Built by education and tech experts, this course is designed for a school-level understanding of AI. It is 100% online and mobile-friendly, making learning accessible anytime, anywhere. With fun quizzes, interactive projects, and practical tools, students stay engaged throughout the course. Upon completion, they receive a digital certificate, and full access is provided through a secure Learning Management System (LMS).",
    ctaClasses: "bg-amber-300",
    routeTo: "#",
  },
];