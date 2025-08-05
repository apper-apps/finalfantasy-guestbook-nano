import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import messageService from "@/services/api/messageService";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const MessageComposer = () => {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!content.trim()) {
      newErrors.content = "메시지를 입력해주세요.";
    }
    if (!authorName.trim()) {
      newErrors.authorName = "작성자 이름을 입력해주세요.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newMessage = {
        text: content.trim(),
        author_name: authorName.trim(),
        created_at: new Date().toISOString(),
        likes: []
      };

      await messageService.create(newMessage);
      toast.success("메시지가 등록되었습니다!");
      setContent("");
      setAuthorName("");
      
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
    <Card className="max-w-2xl mx-auto px-4 md:px-0">
      <CardHeader className="px-4 sm:px-6">
        <h2 className="text-xl font-bold text-gray-100">새 메시지</h2>
        <p className="text-sm text-gray-400">
          Final Fantasy에 대한 생각이나 인사말을 남겨보세요.
        </p>
</CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-300">
              작성자 이름
            </label>
<Input
              id="authorName"
              placeholder="이름을 입력하세요..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={`min-h-[44px] touch-manipulation ${errors.authorName ? "border-red-500" : ""}`}
            />
            {errors.authorName && (
              <p className="text-sm text-red-400">{errors.authorName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              메시지
            </label>
<Textarea
              id="message"
              placeholder="메시지를 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[120px] md:min-h-[150px] resize-none touch-manipulation ${errors.content ? "border-red-500" : ""}`}
              maxLength={280}
            />
            {errors.content && (
              <p className="text-sm text-red-400">{errors.content}</p>
            )}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{content.length}/280</span>
            </div>
          </div>
          
<div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/home")}
              disabled={isSubmitting}
              className="min-h-[44px] px-6 text-base sm:text-sm order-2 sm:order-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || !authorName.trim()}
              className="min-w-[80px] min-h-[44px] px-6 text-base sm:text-sm order-1 sm:order-2"
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