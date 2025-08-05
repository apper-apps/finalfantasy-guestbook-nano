import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useUser } from "@/components/organisms/Layout";
import messageService from "@/services/api/messageService";
import EditMessageModal from "@/components/molecules/EditMessageModal";
import DeleteConfirmDialog from "@/components/molecules/DeleteConfirmDialog";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const AdminPage = () => {
  const { currentUser } = useUser();
const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);

  // Always call hooks before any conditional logic
  useEffect(() => {
    // Only load messages if user is admin
    if (currentUser?.is_admin) {
      loadMessages();
    }
  }, [currentUser?.is_admin]);

  // Render access denied for non-admin users
  if (!currentUser?.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <ApperIcon name="Lock" size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-red-400 mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-400">관리자만 접근할 수 있는 페이지입니다.</p>
        </Card>
      </div>
    );
  }

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getAll();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError("메시지를 불러오는데 실패했습니다.");
      toast.error("메시지 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
  };

  const handleEditSave = async (messageData) => {
    try {
      await messageService.update(editingMessage.Id, messageData);
      await loadMessages();
      setEditingMessage(null);
      toast.success("메시지가 수정되었습니다");
    } catch (err) {
      toast.error("메시지 수정에 실패했습니다");
    }
  };

  const handleDelete = (message) => {
    setDeletingMessage(message);
  };

  const handleDeleteConfirm = async () => {
    try {
      await messageService.delete(deletingMessage.Id);
      await loadMessages();
      setDeletingMessage(null);
      toast.success("메시지가 삭제되었습니다");
    } catch (err) {
      toast.error("메시지 삭제에 실패했습니다");
    }
  };

  const formatDate = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ko
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">메시지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center border-red-500/30">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-red-400 mb-2">오류 발생</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={loadMessages} variant="outline">
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="admin-gradient rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Shield" size={32} />
          <div>
            <h1 className="text-2xl font-bold">관리자 전용</h1>
            <p className="text-red-100">전체 메시지 관리 대시보드</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="MessageSquare" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">전체 메시지</p>
              <p className="text-xl font-bold admin-text">{messages.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Heart" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">총 좋아요</p>
              <p className="text-xl font-bold admin-text">
                {messages.reduce((total, msg) => total + (msg.likes?.length || 0), 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Users" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">작성자 수</p>
              <p className="text-xl font-bold admin-text">
                {new Set(messages.map(msg => msg.author_name)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold admin-text flex items-center space-x-2">
            <ApperIcon name="Table" size={24} />
            <span>메시지 관리</span>
          </h2>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="MessageSquareOff" size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">등록된 메시지가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">메시지</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">작성자</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">작성일</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">좋아요</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.Id} className="border-b border-gray-800 hover:bg-surface/30">
                      <td className="py-3 px-4 text-gray-400">#{message.Id}</td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="truncate" title={message.text}>
                          {message.text}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{message.author_name}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 text-red-400">
                          <ApperIcon name="Heart" size={16} />
                          <span>{message.likes?.length || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(message)}
                            className="hover:text-blue-400"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(message)}
                            className="hover:text-red-400"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingMessage && (
        <EditMessageModal
          message={editingMessage}
          onSave={handleEditSave}
          onClose={() => setEditingMessage(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingMessage && (
        <DeleteConfirmDialog
          message={deletingMessage}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMessage(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;