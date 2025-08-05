import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DeleteConfirmDialog = ({ message, onConfirm, onCancel }) => {
  const isMultiple = Array.isArray(message);
  const messages = isMultiple ? message : [message];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-red-500/30">
        <CardHeader>
          <div className="flex items-center space-x-3 text-red-400">
            <ApperIcon name="AlertTriangle" size={24} />
<h3 className="text-lg font-bold">
              {isMultiple ? `${messages.length}개 메시지 삭제 확인` : '메시지 삭제 확인'}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">
              {isMultiple 
                ? `선택한 ${messages.length}개의 메시지를 정말 삭제하시겠습니까?`
                : '정말 삭제하시겠습니까?'
              }
            </p>
            {isMultiple ? (
              <div className="bg-surface p-3 rounded-lg border border-red-500/30 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-400 mb-2">삭제될 메시지:</p>
                {messages.slice(0, 3).map((msg, index) => (
                  <div key={msg.Id} className="mb-2 last:mb-0">
                    <p className="text-xs text-gray-400">
                      #{msg.Id} - {msg.author_name}
                    </p>
                    <p className="text-sm text-gray-300 truncate">
                      {msg.text}
                    </p>
                  </div>
                ))}
                {messages.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    ... 그리고 {messages.length - 3}개 더
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-surface p-3 rounded-lg border border-red-500/30">
                <p className="text-sm text-gray-400 mb-1">
                  작성자: <span className="text-gray-300">{messages[0].author_name}</span>
                </p>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {messages[0].text}
                </p>
              </div>
            )}

<div className="flex space-x-3 pt-4">
              <Button
                variant="danger"
                onClick={onConfirm}
                className="flex-1"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                {isMultiple ? `${messages.length}개 삭제` : '삭제'}
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