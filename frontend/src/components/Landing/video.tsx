import CollapseCardFeatures from "./collapseCard";

export const Video = () => {
  return (
    <div
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4' stroke-opacity='0.2'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    }}
    
      className="relative min-h-screen bg-white flex items-center justify-center px-4 md:px-8 lg:px-12 py-12"
    >
      <div className="max-w-5xl w-full flex flex-col items-center gap-6 md:gap-8">
        {/* Video Section */}
        <div className="rounded-xl bg-slate-800 shadow-xl w-full overflow-hidden">
          {/* Window-style Header */}
          <div className="flex gap-1.5 rounded-t-xl bg-gradient-to-br from-purple-500 from-40% to-indigo-400 p-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-300" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          
          {/* Video Element with proper aspect ratio */}
          <div className="relative w-full pt-[56.25%]">
            <video
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Card Features Section */}
        <div className="w-full px-2 sm:px-4">
          <CollapseCardFeatures />
        </div>
      </div>
    </div>
  );
};