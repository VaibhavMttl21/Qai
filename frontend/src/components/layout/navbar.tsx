import React, { useEffect, useRef, useState, FC } from "react";
import { useAnimate, motion } from "framer-motion";
import { FiMenu, FiArrowUpRight } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/store/auth";

const Example: FC = () => {
  return (
    <section
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23171717'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <GlassNavigation />

      <span className="absolute -top-[600px] left-[50%] h-[720px] w-4/5 max-w-3xl -translate-x-[50%] rounded bg-[#E3E3E3]" />
    </section>
  );
};

const GlassNavigation: FC = () => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [scope, animate] = useAnimate();
  const navRef = useRef<HTMLElement>(null);

  // Create a separate handler for native DOM events
  const handleNativeMouseMove = (e: globalThis.MouseEvent): void => {
    const element = e.target as HTMLElement;
    const isNavElement = element.classList.contains("glass-nav");

    if (isNavElement) {
      setHovered(true);

      const top = e.offsetY + "px";
      const left = e.offsetX + "px";

      animate(scope.current, { top, left }, { duration: 0 });
    } else {
      setHovered(false);
    }
  };

  useEffect(() => {
    // Use the native DOM event handler here
    navRef.current?.addEventListener("mousemove", handleNativeMouseMove);

    return () =>
      navRef.current?.removeEventListener("mousemove", handleNativeMouseMove);
  }, []);

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: hovered ? "none" : "auto",
      }}
      className="glass-nav  fixed left-0 right-0 top-0 z-50 mx-auto max-w-6xl overflow-hidden border-[1px] border-black/5 bg-gradient-to-br from-black/80 to-black/70  md:left-6 md:right-6 md:top-6 md:rounded-2xl" //backdrop-blur
    >
      <div className="glass-nav flex items-center justify-between px-5 py-5">
        <Cursor hovered={hovered} scope={scope} />

        <Links />

        <Logo />

        <Buttons setMenuOpen={setMenuOpen} />
      </div>

      <MobileMenu menuOpen={menuOpen} />
    </nav>
  );
};

interface CursorProps {
  hovered: boolean;
  scope: React.Ref<any>;
}

const Cursor: FC<CursorProps> = ({ hovered, scope }) => {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: hovered ? 1 : 0,
        transform: `scale(${hovered ? 1 : 0}) translateX(-50%) translateY(-50%)`,
      }}
      transition={{ duration: 0.15 }}
      ref={scope}
      {...{className :"pointer-events-none absolute z-0 grid h-[50px] w-[50px] origin-[0px_0px] place-content-center rounded-full bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-2xl"}}
    >
      <FiArrowUpRight className="text-white" />
    </motion.span>
  );
};

const Logo: FC = () => (
  <span className="pointer-events-none relative left-0 top-[50%] z-10 text-4xl font-black text-white/20  md:absolute md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%]">
    QAI.
  </span>
);

const Links: FC = () => (
  <div className="hidden items-center gap-2 md:flex scroll-smooth">
    
    <GlassLink text="Intro" href="#intro"/>
    <GlassLink text="Testimonials" href="#testimonials"/>

    <GlassLink text="Why us" href="#why"/>
   
   
  </div>
);

interface GlassLinkProps {
  text: string;
  href: string;
}

const GlassLink: FC<GlassLinkProps> = ({ text,href }) => {
  return (
    <a
      href={href}
      className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95"
    >
      <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
        {text}
      </span>
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
};

interface TextLinkProps {
  text: string;
  href: string;
}

const TextLink: FC<TextLinkProps> = ({ text , href}) => {
  return (
    <a href={href} className="text-white/90 transition-colors hover:text-white">
      {text}
    </a>
  );
};

interface ButtonsProps {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Buttons: FC<ButtonsProps> = ({ setMenuOpen }) => {
  const { token, user } = useAuthStore();
  const isLoggedIn = !!token && !!user;
  
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        {isLoggedIn ? (
          <Link to="/dashboard">
            <button className="relative scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 from-40% to-indigo-400 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95">
              Dashboard
            </button>
          </Link>
        ) : (
          <SignInButton />
        )}
      </div>
      
      {!isLoggedIn && (
        <Link to='/register'>
          <button className="relative scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 from-40% to-indigo-400 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95">
            Sign up
          </button>
        </Link>
      )}

      <button
        onClick={() => setMenuOpen((pv) => !pv)}
        className="ml-2 block scale-100 text-3xl text-white/90 transition-all hover:scale-105 hover:text-white active:scale-95 md:hidden"
      >
        <FiMenu />
      </button>
    </div>
  );
};

const SignInButton: FC = () => {
  return (
    <>
    <Link to="/login">
    <button className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95">
      <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
        Sign in
      </span>
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
    </Link>
    </>
  );
};

interface MobileMenuProps {
  menuOpen: boolean;
}

const MobileMenu: FC<MobileMenuProps> = ({ menuOpen }) => {
  const [ref, { height }] = useMeasure();
  const { token, user } = useAuthStore();
  const isLoggedIn = !!token && !!user;
  return (
    <motion.div
      initial={false}
      animate={{
        height: menuOpen ? height : "0px",
      }}
      {...{className:"block overflow-hidden md:hidden"}}
    >
      <div ref={ref} className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-4">
          <TextLink text="intro" href="#intro" />
          <TextLink text="Testimonials" href="#testimonials" />
          <TextLink text="why us" href="#why" />
        </div>
        {isLoggedIn ? (
          <Link to="/dashboard">
            <button className="relative scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 from-40% to-indigo-400 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95">
              Dashboard
            </button>
          </Link>
        ) : (
          <SignInButton />
        )}
      </div>
    </motion.div>
  );
};

export default Example;
