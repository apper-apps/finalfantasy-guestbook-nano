import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { useUser } from "@/components/organisms/Layout";
import messageService from "@/services/api/messageService";
import DeleteConfirmDialog from "@/components/molecules/DeleteConfirmDialog";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const AdminPage = () => {
  const { currentUser } = useUser();
const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editData, setEditData] = useState({ text: '', author_name: '' });
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
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
    setEditingRowId(message.Id);
    setEditData({
      text: message.text || message.content,
      author_name: message.author_name || message.author
    });
  };

  const handleSave = async (messageId) => {
    try {
      await messageService.update(messageId, editData);
      await loadMessages();
      setEditingRowId(null);
      setEditData({ text: '', author_name: '' });
      toast.success("수정 완료");
    } catch (err) {
      toast.error("메시지 수정에 실패했습니다");
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditData({ text: '', author_name: '' });
  };

const handleDelete = (message) => {
    setDeletingMessage(message);
  };

  const handleBulkDelete = () => {
    setDeletingMessage(selectedMessages);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (Array.isArray(deletingMessage)) {
        // Bulk delete
        await Promise.all(deletingMessage.map(message => messageService.delete(message.Id)));
        toast.success(`${deletingMessage.length}개의 메시지가 삭제되었습니다`);
        setSelectedMessages([]);
        setSelectAll(false);
      } else {
        // Single delete
        await messageService.delete(deletingMessage.Id);
        toast.success("삭제되었습니다");
      }
      await loadMessages();
      setDeletingMessage(null);
    } catch (err) {
      toast.error("메시지 삭제에 실패했습니다");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedMessages([...messages]);
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (message, checked) => {
    if (checked) {
      const newSelected = [...selectedMessages, message];
      setSelectedMessages(newSelected);
      setSelectAll(newSelected.length === messages.length);
    } else {
      const newSelected = selectedMessages.filter(m => m.Id !== message.Id);
      setSelectedMessages(newSelected);
setSelectAll(false);
    }
  };

  const handleExportCSV = () => {
    try {
      // CSV headers
      const headers = ['id', 'text', 'author_name', 'created_at', 'like_count'];
      
      // Convert messages to CSV format
      const csvContent = [
        headers.join(','),
        ...messages.map(message => [
          message.Id,
`"${(message.text || message.content || '').replace(/"/g, '""')}"`, // Escape quotes in text
          `"${(message.author_name || message.author || '').replace(/"/g, '""')}"`, // Escape quotes in author
          new Date(message.created_at || message.timestamp).toISOString(),
          Array.isArray(message.likes) ? message.likes.length : (message.likes ? message.likes.split(',').length : 0)
        ].join(','))
      ].join('\n');

      // Create and download blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `messages_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV 다운로드가 시작되었습니다');
    } catch (error) {
      toast.error('CSV 내보내기 중 오류가 발생했습니다');
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="MessageSquare" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-xl font-bold admin-text">{messages.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Calendar" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Messages Today</p>
              <p className="text-xl font-bold admin-text">
                {(() => {
                  const today = new Date();
                  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
return messages.filter(msg => new Date(msg.created_at || msg.timestamp) >= todayStart).length;
                })()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Users" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Top 3 Authors</p>
              <div className="text-sm admin-text">
                {(() => {
const authorCounts = messages.reduce((acc, msg) => {
                    const authorName = msg.author_name || msg.author || 'Unknown';
                    acc[authorName] = (acc[authorName] || 0) + 1;
                    return acc;
                  }, {});
                  const sortedAuthors = Object.entries(authorCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3);
                  return sortedAuthors.length > 0 
                    ? sortedAuthors.map(([name, count]) => `${name} (${count})`).join(', ')
                    : 'No data';
                })()}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-red-500/30">
          <div className="flex items-center space-x-3">
            <ApperIcon name="BarChart3" size={24} className="text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Avg Message Length</p>
              <p className="text-xl font-bold admin-text">
                {(() => {
                  if (messages.length === 0) return 0;
const totalChars = messages.reduce((sum, msg) => sum + ((msg.text || msg.content || '').length || 0), 0);
                  return Math.round(totalChars / messages.length);
                })()}
                <span className="text-sm text-gray-400 ml-1">chars</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
<CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold admin-text flex items-center space-x-2">
              <ApperIcon name="Table" size={24} />
              <span>메시지 관리</span>
            </h2>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center space-x-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
            >
              <ApperIcon name="Download" size={16} />
              <span>CSV 내보내기</span>
            </Button>
          </div>
        </CardHeader>
<CardContent>
          {selectedMessages.length > 0 && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
              <span className="text-red-400">
                {selectedMessages.length}개의 메시지가 선택됨
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Trash2" size={16} />
                <span>선택 삭제</span>
              </Button>
            </div>
          )}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-300 w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
                      />
                    </th>
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
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedMessages.some(m => m.Id === message.Id)}
                          onChange={(e) => handleSelectMessage(message, e.target.checked)}
                          className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-400">#{message.Id}</td>
                      <td className="py-3 px-4 max-w-xs">
                        {editingRowId === message.Id ? (
                          <Textarea
                            value={editData.text}
                            onChange={(e) => setEditData(prev => ({ ...prev, text: e.target.value }))}
                            className="min-h-[60px] resize-none"
                            rows={2}
                          />
                        ) : (
<div className="truncate" title={message.text || message.content}>
                            {message.text || message.content}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingRowId === message.Id ? (
                          <Input
                            value={editData.author_name}
                            onChange={(e) => setEditData(prev => ({ ...prev, author_name: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
<span className="text-gray-300">{message.author_name || message.author}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
{formatDate(message.created_at || message.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 text-red-400">
                          <ApperIcon name="Heart" size={16} />
<span>{Array.isArray(message.likes) ? message.likes.length : (message.likes ? message.likes.split(',').filter(l => l.trim()).length : 0)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {editingRowId === message.Id ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSave(message.Id)}
                              className="hover:text-green-400"
                            >
                              <ApperIcon name="Check" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancel}
                              className="hover:text-red-400"
                            >
                              <ApperIcon name="X" size={16} />
                            </Button>
                          </div>
                        ) : (
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>


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