import { IconLoader } from "@tabler/icons-react";

type LoadingProps = {
  type?: string,
}

const Loading: React.FC<LoadingProps> = ({ type }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <IconLoader className={`animate-spin ${type === 'primary' ? 'text-primary' : 'text-white'}`} />
    </div>
  )
}
export default Loading;
