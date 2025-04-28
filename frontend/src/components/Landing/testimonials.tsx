import { useState } from "react";
import { motion } from "framer-motion";
import {
  SiDribbble,
  SiMovistar,
  SiAirtable,
  SiAndroid,
  SiHomeassistant,
  SiGoogleassistant,
} from "react-icons/si";

const StackedCardTestimonials = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="relative bg-white py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      {/* 🌪 Top-Left Rotating */}
      <motion.img
        as="img"
        src="/two.png"
        alt="Rotating Decorative"
        className="absolute top-8 left-4 w-20 lg:w-80 opacity-40 pointer-events-none z-0"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      />

      {/* 🪄 Bottom-Right Floating */}
      <motion.img
        src="/one.png"
        alt="Floating Decorative"
        className="absolute bottom-4 right-4 w-20 lg:w-40 opacity-70 pointer-events-none z-0"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 💬 Text Content */}
      <div className="p-4 z-10">
        <h3 className="text-5xl font-semibold">What our Students think</h3>
        <p className="text-slate-500 my-4">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus
          commodi sint, similique cupiditate possimus suscipit delectus illum
          eos iure magnam!
        </p>
        <SelectBtns
          numTracks={testimonials.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>

      {/* 📇 Testimonial Cards */}
      <Cards
        testimonials={testimonials}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
};

// Pagination dots
const SelectBtns = ({ numTracks, setSelected, selected }: { numTracks: number; setSelected: (n: number) => void; selected: number }) => {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-1.5 w-full bg-slate-300 relative"
          >
            {selected === n ? (
              <motion.span
                {...{className:"absolute top-0 left-0 bottom-0 bg-slate-950"}}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5 }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute top-0 left-0 bottom-0 bg-slate-950"
                style={{
                  width: selected > n ? "100%" : "0%",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Card Stack
// Define the type for a single testimonial
type Testimonial = {
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  name: string;
};

// Update the Cards component to use the Testimonial type
const Cards = ({
  testimonials,
  selected,
  setSelected,
}: {
  testimonials: Testimonial[];
  selected: number;
  setSelected: (position: number) => void;
}) => {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl z-10">
      {testimonials.map((t, i) => {
        return (
          <Card
          title={""} {...t}
          key={i}
          position={i}
          selected={selected}
          setSelected={setSelected}          />
        );
      })}
    </div>
  );
};

// Individual Card
const Card = ({
  Icon,
  description,
  name,
  title,
  position,
  selected,
  setSelected,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  name: string;
  title: string;
  position: number;
  selected: number;
  setSelected: (position: number) => void;
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const background = position % 2 ? "black" : "white";
  const color = position % 2 ? "white" : "black";

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: "left bottom",
        background,
        color,
      }}
      animate={{
        x: `${offset}%`,
        scale,
      }}
      whileHover={{
        translateX: position === selected ? 0 : -3,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onClick={() => setSelected(position)}
      className="absolute top-0 left-0 w-full min-h-full p-8 lg:p-12 cursor-pointer flex flex-col justify-between"
    >
      <Icon className="text-7xl mx-auto" />
      <p className="text-lg lg:text-xl font-light italic my-8">
        "{description}"
      </p>
      <div>
        <span className="block font-semibold text-lg">{name}</span>
        <span className="block text-sm">{title}</span>
      </div>
    </motion.div>
  );
};

export default StackedCardTestimonials;

// Testimonial Data
const testimonials = [
  {
    Icon: SiHomeassistant,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Jane Dodson",
  },
  {
    Icon: SiGoogleassistant,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Johnathan Rodriguez",
  },
  {
    Icon: SiDribbble,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Phil Heath",
  },
  {
    Icon: SiMovistar,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Andrea Beck",
  },
  {
    Icon: SiAirtable,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Daniel Henderson",
  },
  {
    Icon: SiAndroid,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita sequi cupiditate harum repellendus ipsum dignissimos? Officiis ipsam dolorum magnam assumenda.",
    name: "Anderson Lima",
  },
];
