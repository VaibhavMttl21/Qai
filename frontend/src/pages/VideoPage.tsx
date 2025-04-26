import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '@/store/video';

export function VideoPage() {
  const navigate = useNavigate();
  const { videos, fetchVideos } = useVideoStore();
  
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  
  useEffect(() => {
    if (videos.length > 0) {
      navigate(`/modules`);
    }
  }, [videos, navigate]);
  
  return (
    <div className="flex justify-center items-center h-screen"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}