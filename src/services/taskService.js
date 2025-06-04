// Task Service for managing task data operations

export class TaskService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'task1';
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

  // Get all updateable fields for task
  getUpdateableFields() {
    return [
      'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 
      'status', 'due_date', 'category', 'assignee_id', 'subtasks', 
      'comments', 'project_id'
    ];
  }

  // Get all fields including system fields for fetching
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 
      'status', 'due_date', 'category', 'assignee_id', 'subtasks', 
      'comments', 'project_id'
    ];
  }

  // Fetch all tasks with optional filtering
  async fetchTasks(filters = {}) {
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

      if (filters.category) {
        whereConditions.push({
          fieldName: "category",
          operator: "ExactMatch",
          values: [filters.category]
        });
      }

      if (filters.project_id) {
        whereConditions.push({
          fieldName: "project_id",
          operator: "ExactMatch",
          values: [filters.project_id]
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
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: this.getAllFields()
      };

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  }

  // Create new tasks (supports bulk creation)
  async createTasks(tasksData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format tasks data to match database schema
      const formattedTasks = tasksData.map(task => {
        const formattedTask = {
          Name: task.name || task.Name || task.title || '',
          title: task.title || task.name || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          status: task.status || 'todo',
          category: task.category || 'work'
        };

        // Handle due_date - ensure proper Date format (YYYY-MM-DD)
        if (task.due_date || task.dueDate) {
          const dateValue = task.due_date || task.dueDate;
          if (dateValue instanceof Date) {
            formattedTask.due_date = dateValue.toISOString().split('T')[0];
          } else if (typeof dateValue === 'string') {
            formattedTask.due_date = dateValue.split('T')[0];
          }
        }

        // Handle tags - convert array to comma-separated string
        if (task.tags && Array.isArray(task.tags)) {
          formattedTask.Tags = task.tags.join(',');
        } else if (task.Tags) {
          formattedTask.Tags = task.Tags;
        }

        // Handle lookups
        if (task.assignee_id || task.assigneeId) {
          formattedTask.assignee_id = task.assignee_id || task.assigneeId;
        }

        if (task.project_id || task.projectId) {
          formattedTask.project_id = task.project_id || task.projectId;
        }

        if (task.owner || task.Owner) {
          formattedTask.Owner = task.owner || task.Owner;
        }

        // Handle text fields
        if (task.subtasks) {
          formattedTask.subtasks = task.subtasks;
        }

        if (task.comments) {
          formattedTask.comments = task.comments;
        }

        return formattedTask;
      });

      const params = {
        records: formattedTasks
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Task creation failed");
      }
    } catch (error) {
      console.error("Error creating tasks:", error);
      throw error;
    }
  }

  // Update existing tasks (supports bulk update)
  async updateTasks(tasksData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Format tasks data with IDs
      const formattedTasks = tasksData.map(task => {
        const formattedTask = {
          Id: task.Id || task.id,
          Name: task.name || task.Name || task.title,
          title: task.title || task.name,
          description: task.description,
          priority: task.priority,
          status: task.status,
          category: task.category
        };

        // Handle due_date formatting
        if (task.due_date || task.dueDate) {
          const dateValue = task.due_date || task.dueDate;
          if (dateValue instanceof Date) {
            formattedTask.due_date = dateValue.toISOString().split('T')[0];
          } else if (typeof dateValue === 'string') {
            formattedTask.due_date = dateValue.split('T')[0];
          }
        }

        // Handle tags
        if (task.tags && Array.isArray(task.tags)) {
          formattedTask.Tags = task.tags.join(',');
        } else if (task.Tags) {
          formattedTask.Tags = task.Tags;
        }

        // Handle lookups
        if (task.assignee_id || task.assigneeId) {
          formattedTask.assignee_id = task.assignee_id || task.assigneeId;
        }

        if (task.project_id || task.projectId) {
          formattedTask.project_id = task.project_id || task.projectId;
        }

        if (task.owner || task.Owner) {
          formattedTask.Owner = task.owner || task.Owner;
        }

        // Handle text fields
        if (task.subtasks !== undefined) {
          formattedTask.subtasks = task.subtasks;
        }

        if (task.comments !== undefined) {
          formattedTask.comments = task.comments;
        }

        return formattedTask;
      });

      const params = {
        records: formattedTasks
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      } else {
        throw new Error("Task update failed");
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
      throw error;
    }
  }

  // Delete tasks by IDs (supports bulk deletion)
  async deleteTasks(taskIds) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Ensure taskIds is an array
      const idsArray = Array.isArray(taskIds) ? taskIds : [taskIds];

      const params = {
        RecordIds: idsArray
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success) {
        return true;
      } else {
        throw new Error("Task deletion failed");
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const taskService = new TaskService();