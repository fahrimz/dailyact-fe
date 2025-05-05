const API_BASE_URL = import.meta.env.VITE_API_URL;

export type Role = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
  role: Role;
  created_at: string;
  last_login_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  description: string;
  notes: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateActivity extends Omit<Activity, "id" | "category" | "date" | "duration" | "created_at" | "updated_at"> {}

export interface PaginationQuery {
  page: number;
  pageSize: number;
}

export interface FilterActivity {
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface FilterUser {
  search?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  verifyGoogleToken: async (idToken: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/google/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    });
    if (!response.ok) {
      throw new Error('Failed to verify Google token');
    }
    return response.json();
  },
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    return response.json();
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    return response.json();
  },
};

export const categoriesApi = {
  getCategories: async (query: PaginationQuery): Promise<ApiResponse<Category[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/categories?page=${query.page}&page_size=${query.pageSize}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  createCategory: async (category: Pick<Category, 'name' | 'description'>): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  updateCategory: async (id: number, category: Pick<Category, 'name' | 'description'>): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return response.json();
  },

  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    return response.json();
  },
};

export const activitiesApi = {
  getActivities: async (query: PaginationQuery & FilterActivity): Promise<ApiResponse<Activity[]>> => {
    const queryStr = new URLSearchParams();
    queryStr.set('page', query.page.toString());
    queryStr.set('page_size', query.pageSize.toString());
    if (query.category_id) {
      queryStr.set('category_id', query.category_id.toString());
    }
    if (query.start_date) {
      queryStr.set('start_date', query.start_date);
    }
    if (query.end_date) {
      queryStr.set('end_date', query.end_date);
    }

    const response = await fetch(
      `${API_BASE_URL}/activities?${queryStr.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  },
  createActivity: async (payload: CreateActivity): Promise<ApiResponse<Activity>> => {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to create activity');
    }
    return response.json();
  },
  updateActivity: async (id: number, activity: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(activity),
    });
    if (!response.ok) {
      throw new Error('Failed to update activity');
    }
    return response.json();
  },
  deleteActivity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete activity');
    }
    return response.json();
  },
};

export const usersApi = {
  getUsers: async (query: PaginationQuery & FilterUser): Promise<ApiResponse<User[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${query.page}&page_size=${query.pageSize}&name=${query.search || ''}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },
  createUser: async (user: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },
};