import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import messageService from "@/services/api/messageService";

const MessageComposer = () => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("메시지를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newMessage = {
        content: content.trim(),
        author: "익명",
        timestamp: new Date().toISOString(),
      };

      await messageService.create(newMessage);
      toast.success("메시지가 등록되었습니다!");
      setContent("");
      
      // Navigate to home page after successful submission
      setTimeout(() => {
        navigate("/home");
      }, 1000);
      
    } catch (err) {
      toast.error("메시지 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-100">새 메시지</h2>
        <p className="text-sm text-gray-400">
          Final Fantasy에 대한 생각이나 인사말을 남겨보세요.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              메시지
            </label>
            <Textarea
              id="message"
              placeholder="메시지를 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{content.length}/500</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/home")}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="min-w-[80px]"
            >
              {isSubmitting ? "등록 중..." : "등록"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageComposer;