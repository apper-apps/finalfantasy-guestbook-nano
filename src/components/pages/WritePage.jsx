import { motion } from "framer-motion";
import MessageComposer from "@/components/organisms/MessageComposer";

const WritePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          메시지 작성
        </h1>
        <p className="text-gray-400">
          다른 팬들과 나누고 싶은 이야기를 적어보세요
        </p>
      </div>
      
      <MessageComposer />
    </motion.div>
  );
};

export default WritePage;