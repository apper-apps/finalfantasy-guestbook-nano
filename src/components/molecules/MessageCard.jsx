import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const MessageCard = ({ message, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:bg-surface/80 transition-colors duration-200">
        <CardContent className="p-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                {message.author || "익명"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
            <p className="text-gray-100 leading-6 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageCard;