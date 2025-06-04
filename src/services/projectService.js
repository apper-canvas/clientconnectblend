// Project Service for managing project data operations

export class ProjectService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'project';
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

  // Get all updateable fields for project
  getUpdateableFields() {
    return [
      'Name', 'Tags', 'Owner', 'description', 'priority', 'due_date', 'status'
    ];
  }

  // Get all fields including system fields for fetching
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'description', 'priority', 'due_date', 'status'
    ];
  }

  // Fetch all projects with optional filtering
  async fetchProjects(filters = {}) {
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
      const whereConditions = [];
      
      if (filters.status) {
        whereConditions.push({
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        });
      }

      if (filters.priority) {
        whereConditions.push({
          fieldName: "priority",
          operator: "ExactMatch",
          values: [filters.priority]
        });
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  // Get a single project by ID
  async getProjectById(projectId) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: this.getAllFields()
      };

      const response = await this.apperClient.getRecordById(this.tableName, projectId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${projectId}:`, error);
      throw error;
    }
  }

  // Create new projects (supports bulk creation)
  async createProjects(projectsData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format projects data to match database schema
      const formattedProjects = projectsData.map(project => {
        const formattedProject = {
          Name: project.name || project.Name || '',
          description: project.description || '',
          priority: project.priority || 'medium',
          status: project.status || 'active'
        };

        // Handle due_date - ensure proper Date format (YYYY-MM-DD)
        if (project.due_date || project.dueDate) {
          const dateValue = project.due_date || project.dueDate;
          if (dateValue instanceof Date) {
            formattedProject.due_date = dateValue.toISOString().split('T')[0];
          } else if (typeof dateValue === 'string') {
            formattedProject.due_date = dateValue.split('T')[0];
          }
        }

        // Handle tags - convert array to comma-separated string
        if (project.tags && Array.isArray(project.tags)) {
          formattedProject.Tags = project.tags.join(',');
        } else if (project.Tags) {
          formattedProject.Tags = project.Tags;
        }

        // Handle owner lookup
        if (project.owner || project.Owner) {
          formattedProject.Owner = project.owner || project.Owner;
        }

        return formattedProject;
      });

      const params = {
        records: formattedProjects
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Project creation failed");
      }
    } catch (error) {
      console.error("Error creating projects:", error);
      throw error;
    }
  }

  // Update existing projects (supports bulk update)
  async updateProjects(projectsData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format projects data with IDs
      const formattedProjects = projectsData.map(project => {
        const formattedProject = {
          Id: project.Id || project.id,
          Name: project.name || project.Name,
          description: project.description,
          priority: project.priority,
          status: project.status
        };

        // Handle due_date formatting
        if (project.due_date || project.dueDate) {
          const dateValue = project.due_date || project.dueDate;
          if (dateValue instanceof Date) {
            formattedProject.due_date = dateValue.toISOString().split('T')[0];
          } else if (typeof dateValue === 'string') {
            formattedProject.due_date = dateValue.split('T')[0];
          }
        }

        // Handle tags
        if (project.tags && Array.isArray(project.tags)) {
          formattedProject.Tags = project.tags.join(',');
        } else if (project.Tags) {
          formattedProject.Tags = project.Tags;
        }

        // Handle owner
        if (project.owner || project.Owner) {
          formattedProject.Owner = project.owner || project.Owner;
        }

        return formattedProject;
      });

      const params = {
        records: formattedProjects
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Project update failed");
      }
    } catch (error) {
      console.error("Error updating projects:", error);
      throw error;
    }
  }

  // Delete projects by IDs (supports bulk deletion)
  async deleteProjects(projectIds) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Ensure projectIds is an array
      const idsArray = Array.isArray(projectIds) ? projectIds : [projectIds];

      const params = {
        RecordIds: idsArray
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success) {
        return true;
      } else {
        throw new Error("Project deletion failed");
      }
    } catch (error) {
      console.error("Error deleting projects:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();