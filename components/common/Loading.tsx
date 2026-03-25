import { useEffect, useState } from 'react';

type LoadingProps = {
  type?: string;
};

const GIF_FILES = [
  'construction-assistant.gif',
  'crane.gif',
  'mixer-truck.gif',
  'paint-roller.gif',
  'wall.gif',
];

const pickRandomGifFile = () => {
  const idx = Math.floor(Math.random() * GIF_FILES.length);
  return GIF_FILES[idx] || GIF_FILES[0];
};

const Loading: React.FC<LoadingProps> = ({ type }) => {
  const initialGifFile = type === 'secondary' ? 'paint-roller.gif' : 'wall.gif';
  const [gifFile, setGifFile] = useState<string>(initialGifFile);

  // Pick a random gif on mount so every time `Loading` is shown it feels fresh.
  useEffect(() => {
    setGifFile(pickRandomGifFile());
  }, [type]);

  const sizeClass =
    type === 'secondary'
      ? 'w-16 h-16'
      : 'w-44 h-44 max-w-[55vw] max-h-[45vh]';

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Use plain <img> since these are gif animations in /public */}
      <img
        src={`/gifs/${gifFile}`}
        alt="Loading..."
        className={`object-contain ${sizeClass}`}
        draggable={false}
      />
    </div>
  );
};
export default Loading;
