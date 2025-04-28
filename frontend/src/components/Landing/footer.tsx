export default function Footer() {
  return (
    <footer className="bg-[#e0b0ff] text-black px-6 py-10 md:py-14 relative overflow-hidden">
      {/* //e0b0ff  */}
      {/* border-[1px] border-black/5 bg-gradient-to-br from-black/50 to-black/70 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Rotating PNG on the left */}
        

        {/* Social Media Centered */}
        <div className="flex flex-col items-center gap-4 order-3 md:order-none">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br />
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua <br />
           Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris <br />
           ut aliquip ex ea commodo consequat. </p>
          {/* <p className="text-sm text-black">Connect with us</p>
          <div className="flex gap-5 text-xl">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-500 transition"><FaLinkedinIn /></a>
          </div> */}
        </div>

        {/* Logo and Address on the right */}
        <div className="flex flex-col items-end text-right gap-2">
          <img src="/logo69.jpeg" alt="Logo" className="w-28 md:w-36 rounded-full" />
          <address className="text-sm text-black not-italic">
            Skill static Inc.<br />
            Vill. chhiachhi ,<br />
            Nalagarh, IN
          </address>
        </div>
      </div>
      <div>
        
      </div>
      

      {/* Optional: bottom border line glow */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm opacity-40" />
    </footer>
  );
}
