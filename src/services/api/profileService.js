const profileService = {
  // Initialize ApperClient for database operations
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  async getByUserId(userId) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'profile';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user" } },
          { field: { Name: "role" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "user",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching profile by user ID:", response.message);
        throw new Error(response.message);
      }
      
      // Return first profile found or null if none exists
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error in profileService.getByUserId:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'profile';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user" } },
          { field: { Name: "role" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching profile by ID:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Profile not found");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error in profileService.getById:", error.message);
      throw error;
    }
  },

  async create(profileData) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'profile';
      
      // Only include Updateable fields based on schema
      const params = {
        records: [
          {
            Name: profileData.Name || `Profile for User ${profileData.user}`,
            user: parseInt(profileData.user), // Lookup field - send as integer ID
            role: profileData.role || "member", // Default to member role
            Tags: profileData.Tags || ""
          }
        ]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating profile:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create profile ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
      
      throw new Error("Failed to create profile");
    } catch (error) {
      console.error("Error in profileService.create:", error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'profile';
      
      // Only include Updateable fields based on schema
      const updateRecord = {
        Id: parseInt(id)
      };
      
      // Add only provided updateable fields
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.user !== undefined) updateRecord.user = parseInt(updateData.user);
      if (updateData.role !== undefined) updateRecord.role = updateData.role;
      if (updateData.Tags !== undefined) updateRecord.Tags = updateData.Tags;
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating profile:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update profile ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
      
      throw new Error("Failed to update profile");
    } catch (error) {
      console.error("Error in profileService.update:", error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const tableName = 'profile';
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error deleting profile:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete profile ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error in profileService.delete:", error.message);
      throw error;
    }
  }
};

export default profileService;