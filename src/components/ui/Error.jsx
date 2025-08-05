import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "오류가 발생했습니다.", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertCircle" size={32} className="text-error" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            문제가 발생했습니다
          </h3>
          
          <p className="text-gray-400 mb-6">
            {message}
          </p>
          
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              다시 시도
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Error;