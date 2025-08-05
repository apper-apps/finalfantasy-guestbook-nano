import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Textarea } from "@/components/atoms/Textarea";
import { Input } from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const EditMessageModal = ({ message, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    text: message.text,
    author_name: message.author_name
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.author_name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-red-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold admin-text flex items-center space-x-2">
              <ApperIcon name="Edit" size={20} />
              <span>메시지 수정</span>
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="hover:text-red-400"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                작성자
              </label>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="작성자 이름"
                className="border-red-500/30 focus:border-red-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                메시지
              </label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="메시지 내용"
                rows={4}
                className="border-red-500/30 focus:border-red-400"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                variant="danger"
                disabled={saving || !formData.text.trim() || !formData.author_name.trim()}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    저장
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={saving}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMessageModal;