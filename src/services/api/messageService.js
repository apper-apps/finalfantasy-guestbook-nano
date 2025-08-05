const messageService = {
  // Initialize ApperClient for database operations
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'message';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "likes" } },
          { field: { Name: "author" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching messages:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in messageService.getAll:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'message';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "likes" } },
          { field: { Name: "author" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching message by ID:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Message not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error in messageService.getById:", error.message);
      throw error;
    }
  },

  async create(messageData) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'message';
      
      // Only include Updateable fields based on schema
      const params = {
        records: [
          {
            Name: messageData.Name || "New Message",
            text: messageData.text,
            author_name: messageData.author_name,
            created_at: messageData.created_at || new Date().toISOString(),
            likes: messageData.likes || "",
            author: messageData.author || messageData.author_name,
            content: messageData.content || messageData.text,
            timestamp: messageData.timestamp || messageData.created_at || new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating message:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create message ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error("Failed to create message");
    } catch (error) {
      console.error("Error in messageService.create:", error.message);
      throw error;
    }
  },

  async toggleLike(id, userId) {
    try {
      // First get the current message to retrieve current likes
      const currentMessage = await this.getById(id);
      const currentLikes = currentMessage.likes ? currentMessage.likes.split(',').filter(l => l.trim()) : [];
      const userLikeIndex = currentLikes.indexOf(userId);
      
      let newLikes;
      if (userLikeIndex > -1) {
        // Remove like
        currentLikes.splice(userLikeIndex, 1);
        newLikes = currentLikes;
      } else {
        // Add like
        newLikes = [...currentLikes, userId];
      }
      
      // Update the message with new likes
      const updateData = {
        likes: newLikes.join(',')
      };
      
      const updatedMessage = await this.update(id, updateData);
      
      // Return message with likes as array for compatibility
      return {
        ...updatedMessage,
        likes: newLikes
      };
    } catch (error) {
      console.error("Error in messageService.toggleLike:", error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'message';
      
      // Only include Updateable fields based on schema
      const updateRecord = {
        Id: parseInt(id)
      };
      
      // Add only provided updateable fields
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.text !== undefined) updateRecord.text = updateData.text;
      if (updateData.author_name !== undefined) updateRecord.author_name = updateData.author_name;
      if (updateData.created_at !== undefined) updateRecord.created_at = updateData.created_at;
      if (updateData.likes !== undefined) updateRecord.likes = updateData.likes;
      if (updateData.author !== undefined) updateRecord.author = updateData.author;
      if (updateData.content !== undefined) updateRecord.content = updateData.content;
      if (updateData.timestamp !== undefined) updateRecord.timestamp = updateData.timestamp;
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating message:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update message ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error("Failed to update message");
    } catch (error) {
      console.error("Error in messageService.update:", error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'message';
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error deleting message:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete message ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error in messageService.delete:", error.message);
      throw error;
    }
  }
};

export default messageService;