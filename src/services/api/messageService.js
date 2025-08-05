import messagesData from "@/services/mockData/messages.json";

// Simulate a simple in-memory database
let messages = [...messagesData];

const messageService = {
  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return messages sorted by timestamp (newest first)
    return [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const message = messages.find(msg => msg.Id === parseInt(id));
    if (!message) {
      throw new Error("Message not found");
    }
    
    return { ...message };
  },
async create(messageData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find the highest existing Id and add 1
    const maxId = messages.length > 0 
      ? Math.max(...messages.map(msg => msg.Id))
      : 0;
    
    const newMessage = {
      Id: maxId + 1,
      text: messageData.text,
      author_name: messageData.author_name,
      created_at: messageData.created_at || new Date().toISOString(),
      likes: messageData.likes || []
    };
    
    messages.unshift(newMessage); // Add to beginning to show newest first
    return { ...newMessage };
  },

  async toggleLike(id, userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const messageIndex = messages.findIndex(msg => msg.Id === parseInt(id));
    if (messageIndex === -1) {
      throw new Error("Message not found");
    }
    
    const message = messages[messageIndex];
    const likes = message.likes || [];
    const userLikeIndex = likes.indexOf(userId);
    
    if (userLikeIndex > -1) {
      // Remove like
      likes.splice(userLikeIndex, 1);
    } else {
      // Add like
      likes.push(userId);
    }
    
    messages[messageIndex] = { ...message, likes };
    return { ...messages[messageIndex] };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messageIndex = messages.findIndex(msg => msg.Id === parseInt(id));
    if (messageIndex === -1) {
      throw new Error("Message not found");
    }
    
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...updateData,
      Id: parseInt(id), // Ensure Id remains an integer
    };
    
    return { ...messages[messageIndex] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messageIndex = messages.findIndex(msg => msg.Id === parseInt(id));
    if (messageIndex === -1) {
      throw new Error("Message not found");
    }
    
    const deletedMessage = messages.splice(messageIndex, 1)[0];
    return { ...deletedMessage };
  },
};

export default messageService;