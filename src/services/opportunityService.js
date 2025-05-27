// Opportunity Service for managing opportunity data operations

export class OpportunityService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'opportunity';
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

  // Get all updateable fields for opportunity
  getUpdateableFields() {
    return [
      'Name', 'Tags', 'Owner', 'title', 'value', 'stage', 
      'probability', 'assigned_to', 'contact'
    ];
  }

  // Get all fields including system fields for fetching
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 
      'probability', 'assigned_to', 'contact'
    ];
  }

  // Fetch all opportunities with optional filtering
  async fetchOpportunities(filters = {}) {
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
      console.error("Error fetching opportunities:", error);
      throw error;
    }
  }

  // Get a single opportunity by ID
  async getOpportunityById(opportunityId) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: this.getAllFields()
      };

      const response = await this.apperClient.getRecordById(this.tableName, opportunityId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching opportunity with ID ${opportunityId}:`, error);
      throw error;
    }
  }

  // Create new opportunities (supports bulk creation)
  async createOpportunities(opportunitiesData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format opportunities data to match database schema
      const formattedOpportunities = opportunitiesData.map(opportunity => {
        const formattedOpportunity = {
          title: opportunity.title || '',
          value: parseFloat(opportunity.value) || 0,
          stage: opportunity.stage || 'lead',
          probability: parseInt(opportunity.probability) || 0,
          assigned_to: opportunity.assignedTo || opportunity.assigned_to || ''
        };

        // Set Name field
        formattedOpportunity.Name = opportunity.title || opportunity.Name || '';

        // Handle contact lookup if provided
        if (opportunity.contactId || opportunity.contact) {
          formattedOpportunity.contact = opportunity.contactId || opportunity.contact;
        }

        // Handle tags - convert array to comma-separated string
        if (opportunity.tags && Array.isArray(opportunity.tags)) {
          formattedOpportunity.Tags = opportunity.tags.join(',');
        }

        return formattedOpportunity;
      });

      const params = {
        records: formattedOpportunities
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Opportunity creation failed");
      }
    } catch (error) {
      console.error("Error creating opportunities:", error);
      throw error;
    }
  }

  // Update existing opportunities (supports bulk update)
  async updateOpportunities(opportunitiesData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format opportunities data with IDs
      const formattedOpportunities = opportunitiesData.map(opportunity => ({
        Id: opportunity.Id || opportunity.id,
        title: opportunity.title,
        value: parseFloat(opportunity.value) || 0,
        stage: opportunity.stage,
        probability: parseInt(opportunity.probability) || 0,
        assigned_to: opportunity.assignedTo || opportunity.assigned_to,
        contact: opportunity.contactId || opportunity.contact,
        Name: opportunity.title || opportunity.Name,
        Tags: opportunity.tags && Array.isArray(opportunity.tags) ? opportunity.tags.join(',') : opportunity.Tags
      }));

      const params = {
        records: formattedOpportunities
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Opportunity update failed");
      }
    } catch (error) {
      console.error("Error updating opportunities:", error);
      throw error;
    }
  }

  // Delete opportunities by IDs (supports bulk deletion)
  async deleteOpportunities(opportunityIds) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Ensure opportunityIds is an array
      const idsArray = Array.isArray(opportunityIds) ? opportunityIds : [opportunityIds];

      const params = {
        RecordIds: idsArray
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success) {
        return true;
      } else {
        throw new Error("Opportunity deletion failed");
      }
    } catch (error) {
      console.error("Error deleting opportunities:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const opportunityService = new OpportunityService();