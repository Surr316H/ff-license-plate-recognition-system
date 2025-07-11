export const Loader = ({ fullscreen }: { fullscreen?: boolean }) => {
  return (
    <div className={`flex space-x-2 ${fullscreen ? 'w-full h-[100vh] items-center justify-ceter' : ''}`}>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};
