import { motion } from "framer-motion";
import MessageFeed from "@/components/organisms/MessageFeed";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Final Fantasy 방명록
        </h1>
        <p className="text-gray-400">
          팬들과 함께 나누는 Final Fantasy 이야기
        </p>
      </div>
      
      <MessageFeed />
    </motion.div>
  );
};

export default HomePage;