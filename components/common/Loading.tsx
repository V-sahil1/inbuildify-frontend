import { IconLoader } from "@tabler/icons-react";

const Loading = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
    zIndex: 10000
  }}>
    <IconLoader className='animate-spin text-[#E27D39] w-[32px] h-[32px]'/>
  </div>
);

export default Loading;