import { IconClock, IconHome, IconTool } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function JobComingSoon() {
  const router = useRouter();

//   useEffect(() => {
//     // Redirect to home after 10 seconds
//     const timer = setTimeout(() => {
//       router.push('/');
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [router]);

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Jobs - Coming Soon | CRMSimplify</title>
        <meta name="description" content="Our jobs section is coming soon. Stay tuned for exciting opportunities!" />
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <IconTool className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Job Page Coming Soon
          </h1>
          
          <p className="text-center text-gray-600 mb-8 text-lg">
            We're working hard to bring you an amazing jobs experience.
            <br />
            Stay tuned for exciting opportunities!
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center text-gray-600">
              <IconClock className="mr-2" />
              <span>Launching Soon</span>
            </div>
          </div>

          {/* <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
            <div 
              className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
              style={{ width: '75%' }}
            ></div>
          </div> */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IconHome className="mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}