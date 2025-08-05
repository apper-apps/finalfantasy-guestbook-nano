import { useState, useEffect } from "react";
import MessageCard from "@/components/molecules/MessageCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import messageService from "@/services/api/messageService";

const MessageFeed = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await messageService.getAll();
      setMessages(data);
    } catch (err) {
      setError("메시지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMessages} />;
  if (messages.length === 0) return <Empty />;

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageCard key={message.Id} message={message} index={index} />
      ))}
    </div>
  );
};

export default MessageFeed;