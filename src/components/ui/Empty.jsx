import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-md mx-auto">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={40} className="text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-100 mb-3">
            첫 메시지를 남겨 보세요!
          </h3>
          
          <p className="text-gray-400 mb-8 leading-6">
            아직 등록된 메시지가 없습니다.<br />
            Final Fantasy에 대한 생각이나<br />
            인사말을 첫 번째로 남겨보세요.
          </p>
          
          <Button
            onClick={() => navigate("/post")}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="PenTool" size={18} className="mr-2" />
            첫 메시지 작성하기
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Empty;