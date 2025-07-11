import { CameraIcon } from "../../../assets";
import { VideoPlayer } from "../../../components";

export const VideoStream = () => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <CameraIcon />
          Live Video Feed
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-red-500 animate-pulse`}></div>
          <span className="text-white text-sm">LIVE</span>
        </div>
      </div>
      
      <div className="relative bg-black rounded aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
          <div className="absolute top-4 left-4 text-green-400 font-mono text-xs">
            CAM_01 | 1920x1080 | 30FPS
          </div>
          <div className="absolute bottom-4 right-4 text-green-400 font-mono text-xs">
            {new Date().toLocaleTimeString()}
          </div>
          
          <div>
            <VideoPlayer 
              src="https://storage.googleapis.com/test12131415123/videoplayback.mp4"
              autoPlay 
              loop 
              muted 
              controls={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}