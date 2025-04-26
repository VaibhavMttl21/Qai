import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiXSquare } from "react-icons/fi";

export const NeuPricing = () => {
  const [selected, setSelected] = useState<ToggleOptionsType>("annual");
  return (
    <div className="bg-zinc-50 ">
      <section className="mx-auto max-w-7xl px-2 py-24 md:px-4">
        <h2 className="mx-auto mb-4 max-w-2xl text-center text-4xl font-bold leading-[1.15] md:text-6xl md:leading-[1.15]">
          Pricing
        </h2>
        <Toggle selected={selected} setSelected={setSelected} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8">
          <PriceColumn
            title="Individuals"
            price="0"
            statement="For individuals looking to up their productivity gains. Free forever."
            items={[
              {
                children: "Access to the first video",
                checked: true,
              },
              {
                children: "Limited features",
                checked: true,
              },
              {
                children: "No commuinity access",
                checked: false,
              },
            ]}
          />
          <PriceColumn
            title="Teams"
            price={selected === "monthly" ? "12" : "8"}
            statement="For teams looking to scale their team efficiently. Stay on track."
            highlight
            items={[
              {
                children: "Access to all educational videos",
                checked: true,
              },
              {
                children: "Community discussion participation",
                checked: true,
              },
              {
                children: "Post and reply in forums",
                checked: true,
              },

              {
                children: "Downloadable resources",
                checked: true,
              },
              {
                children: "Certificate of completion",
                checked: true,
              },
            ]}
          />
          <PriceColumn
            title="Enterprise"
            price={selected === "monthly" ? "24" : "16"}
            statement="For enterprises looking to see new heights. Manage without the stress"
            items={[
              {
                children: "∞ Team Members",
                checked: true,
              },
              {
                children: "∞ Boards",
                checked: true,
              },
              {
                children: "∞ Workflows",
                checked: true,
              },

              {
                children: "Enterprise Support",
                checked: true,
              },
              {
                children: "Custom Branding",
                checked: true,
              },
              {
                children: "Self Host",
                checked: true,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

const PriceColumn = ({
  highlight,
  title,
  price,
  statement,
  items,
}: PriceColumnProps) => {
  return (
    <div
      style={{
        boxShadow: highlight ? "0px 6px 0px rgb(24, 24, 27)" : "",
      }}
      className={`relative w-full rounded-lg p-6 md:p-8 ${highlight ? "border-2 border-zinc-900 bg-white" : ""}`}
    >
      {highlight && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-indigo-600 px-2 py-0.5 text-sm text-white">
          Most Popular
        </span>
      )}

      <p className="mb-6 text-xl font-medium">{title}</p>
      <div className="mb-6 flex items-center gap-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            initial={{
              y: 24,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -24,
              opacity: 0,
            }}
            key={price}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            {...{className:"block text-6xl font-bold"}}
          >
            ${price}
          </motion.span>
        </AnimatePresence>
        <motion.div layout {...{className:"font-medium text-zinc-600"}}>
          <span className="block">/user</span>
          <span className="block">/month</span>
        </motion.div>
      </div>

      <p className="mb-8 text-lg">{statement}</p>

      <div className="mb-8 space-y-2">
        {items.map((i) => (
          <CheckListItem key={i.children} checked={i.checked}>
            {i.children}
          </CheckListItem>
        ))}
      </div>

      <button
        className={`w-full rounded-lg p-3 text-base uppercase text-white transition-colors ${
          highlight
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-zinc-900 hover:bg-zinc-700"
        }`}
      >
        Try it now
      </button>
    </div>
  );
};

const Toggle = ({
  selected,
  setSelected,
}: {
  selected: ToggleOptionsType;
  setSelected: Dispatch<SetStateAction<ToggleOptionsType>>;
}) => {
  return (
    <div className="relative mx-auto mt-3 flex w-fit items-center rounded-full bg-zinc-200">
      <button
        className="relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
        onClick={() => {
          setSelected("monthly");
        }}
      >
        <span className="relative z-10">Monthly</span>
      </button>
      <button
        className="relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
        onClick={() => {
          setSelected("annual");
        }}
      >
        <span className="relative z-10">Annually</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "annual" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ ease: "easeInOut" }}
          {...{className :"h-full w-1/2 rounded-full border border-zinc-900 bg-white"}}
        />
      </div>
    </div>
  );
};

const CheckListItem = ({ children, checked }: CheckListItemType) => {
  return (
    <div className="flex items-center gap-2 text-lg">
      {checked ? (
        <FiCheckCircle className="text-xl text-indigo-600" />
      ) : (
        <FiXSquare className="text-xl text-zinc-400" />
      )}
      {children}
    </div>
  );
};

type PriceColumnProps = {
  highlight?: boolean;
  title: string;
  price: string;
  statement: string;
  items: CheckListItemType[];
};

type ToggleOptionsType = "monthly" | "annual";

type CheckListItemType = {
  children: string;
  checked: boolean;
};