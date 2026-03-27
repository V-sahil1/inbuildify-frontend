import { IconLoader } from '@tabler/icons-react';

type LoadingProps = {
  type?: string;
};

const Loading: React.FC<LoadingProps> = ({ type }) => {
  return (
    <div>
      <IconLoader
        color={'#E37E37'}
        className={`animate-spin ${type === 'primary' ? 'text-primary' : 'text-white'}`}
      />
    </div>
  );
};
export default Loading;
