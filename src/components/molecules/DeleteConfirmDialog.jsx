import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DeleteConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-red-500/30">
        <CardHeader>
          <div className="flex items-center space-x-3 text-red-400">
            <ApperIcon name="AlertTriangle" size={24} />
            <h3 className="text-lg font-bold">메시지 삭제 확인</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">
              정말로 이 메시지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            
            <div className="bg-surface p-3 rounded-lg border border-red-500/30">
              <p className="text-sm text-gray-400 mb-1">
                작성자: <span className="text-gray-300">{message.author_name}</span>
              </p>
              <p className="text-sm text-gray-300 line-clamp-3">
                {message.text}
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="danger"
                onClick={onConfirm}
                className="flex-1"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                삭제
              </Button>
              <Button
                variant="secondary"
                onClick={onCancel}
              >
                취소
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteConfirmDialog;