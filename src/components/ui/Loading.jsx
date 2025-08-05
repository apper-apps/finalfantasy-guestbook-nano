import { motion } from "framer-motion";
import { Card } from "@/components/atoms/Card";

const Loading = () => {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {skeletonItems.map((item) => (
        <Card key={item} className="p-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-gray-600 rounded w-20"></div>
              <div className="h-3 bg-gray-600 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
      ))}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center space-x-2 text-gray-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
          <span>메시지를 불러오는 중...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;