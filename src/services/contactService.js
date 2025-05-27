// Contact Service for managing contact data operations

export class ContactService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'contact4';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Get all updateable fields for contact
  getUpdateableFields() {
    return [
      'Name', 'Tags', 'Owner', 'first_name', 'last_name', 
      'email', 'phone', 'company', 'position', 'stage'
    ];
  }

  // Get all fields including system fields for fetching
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 
      'email', 'phone', 'company', 'position', 'stage'
    ];
  }

  // Fetch all contacts with optional filtering
  async fetchContacts(filters = {}) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: this.getAllFields(),
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };

      // Add filters if provided
      if (filters.stage) {
        params.where = [
          {
            fieldName: "stage",
            operator: "ExactMatch",
            values: [filters.stage]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  // Get a single contact by ID
  async getContactById(contactId) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: this.getAllFields()
      };

      const response = await this.apperClient.getRecordById(this.tableName, contactId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      throw error;
    }
  }

  // Create new contacts (supports bulk creation)
  async createContacts(contactsData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format contacts data to match database schema
      const formattedContacts = contactsData.map(contact => {
        const formattedContact = {
          first_name: contact.firstName || contact.first_name || '',
          last_name: contact.lastName || contact.last_name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company: contact.company || '',
          position: contact.position || '',
          stage: contact.stage || 'lead'
        };

        // Set Name field as combination of first and last name
        formattedContact.Name = `${formattedContact.first_name} ${formattedContact.last_name}`.trim();

        // Handle tags - convert array to comma-separated string
        if (contact.tags && Array.isArray(contact.tags)) {
          formattedContact.Tags = contact.tags.join(',');
        }

        return formattedContact;
      });

      const params = {
        records: formattedContacts
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Contact creation failed");
      }
    } catch (error) {
      console.error("Error creating contacts:", error);
      throw error;
    }
  }

  // Update existing contacts (supports bulk update)
  async updateContacts(contactsData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format contacts data with IDs
      const formattedContacts = contactsData.map(contact => ({
        Id: contact.Id || contact.id,
        first_name: contact.firstName || contact.first_name,
        last_name: contact.lastName || contact.last_name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        stage: contact.stage,
        Name: `${contact.firstName || contact.first_name} ${contact.lastName || contact.last_name}`.trim(),
        Tags: contact.tags && Array.isArray(contact.tags) ? contact.tags.join(',') : contact.Tags
      }));

      const params = {
        records: formattedContacts
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Contact update failed");
      }
    } catch (error) {
      console.error("Error updating contacts:", error);
      throw error;
    }
  }

  // Delete contacts by IDs (supports bulk deletion)
  async deleteContacts(contactIds) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Ensure contactIds is an array
      const idsArray = Array.isArray(contactIds) ? contactIds : [contactIds];

      const params = {
        RecordIds: idsArray
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success) {
        return true;
      } else {
        throw new Error("Contact deletion failed");
      }
    } catch (error) {
      console.error("Error deleting contacts:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const contactService = new ContactService();