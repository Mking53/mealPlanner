// Frontend API client for communicating with the backend server
// This never directly calls Supabase - all calls go through the Node.js server

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class MealPlannerApi {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    // Try to restore token from storage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  hasToken() {
    return Boolean(this.token);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Unknown error');
    }

    return data;
  }

  // ========== Auth API ==========
  async signup(email: string, password: string, fullName: string) {
    const response = await this.request<{
      success: boolean;
      token: string;
      user: { id: string; email: string; fullName: string };
    }>('POST', '/auth/signup', {
      email,
      password,
      fullName,
    });

    this.setToken(response.token);
    return response;
  }

  async signin(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      token: string;
      user: { id: string; email: string; fullName: string };
    }>('POST', '/auth/signin', {
      email,
      password,
    });

    this.setToken(response.token);
    return response;
  }

  async logout() {
    try {
      await this.request<{ success: boolean }>('POST', '/auth/logout', {});
    } finally {
      this.clearToken();
    }
  }

  // ========== Profile API ==========
  async getProfile() {
    return this.request<{
      id: string;
      email: string;
      full_name: string;
      avatar_url?: string | null;
      created_at?: string;
      updated_at?: string;
    }>('GET', '/api/profile');
  }

  async updateProfile(updates: { fullName?: string; avatarUrl?: string }) {
    return this.request('PUT', '/api/profile', updates);
  }

  // ========== Meal Cards API ==========
  async getMealCards() {
    return this.request('GET', '/api/meal-cards');
  }

  async createMealCard(data: {
    name: string;
    mealType: string;
    recipe?: string;
    nutritionalBreakdown?: string;
    imageUrl?: string;
    ingredients?: string[];
  }) {
    return this.request('POST', '/api/meal-cards', data);
  }

  async getMealCard(id: string) {
    return this.request('GET', `/api/meal-cards/${id}`);
  }

  async updateMealCard(
    id: string,
    data: {
      name?: string;
      mealType?: string;
      recipe?: string;
      nutritionalBreakdown?: string;
      imageUrl?: string;
      ingredients?: string[];
    }
  ) {
    return this.request('PUT', `/api/meal-cards/${id}`, data);
  }

  async deleteMealCard(id: string) {
    return this.request('DELETE', `/api/meal-cards/${id}`);
  }

  // ========== Planned Meals API ==========
  async getPlannedMeals(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString();
    return this.request('GET', `/api/planned-meals${query ? '?' + query : ''}`);
  }

  async createPlannedMeal(data: {
    name: string;
    mealType: string;
    plannedDate: string;
    recipe?: string;
    nutritionalBreakdown?: string;
    ingredients?: string[];
    groupId?: string | null;
    mealCardId?: string;
  }) {
    return this.request('POST', '/api/planned-meals', data);
  }

  async getPlannedMeal(id: string) {
    return this.request('GET', `/api/planned-meals/${id}`);
  }

  async updatePlannedMeal(
    id: string,
    data: {
      name?: string;
      mealType?: string;
      plannedDate?: string;
      recipe?: string;
      nutritionalBreakdown?: string;
      wasMade?: boolean;
      ingredients?: string[];
    }
  ) {
    return this.request('PUT', `/api/planned-meals/${id}`, data);
  }

  async deletePlannedMeal(id: string) {
    return this.request('DELETE', `/api/planned-meals/${id}`);
  }

  // ========== Kitchen Items API ==========
  async getKitchenItems(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request('GET', `/api/kitchen-items${query}`);
  }

  async createKitchenItem(data: {
    name: string;
    category: string;
    freeCount?: number;
    allocatedCount?: number;
    isBought?: boolean;
  }) {
    return this.request('POST', '/api/kitchen-items', data);
  }

  async getKitchenItem(id: string) {
    return this.request('GET', `/api/kitchen-items/${id}`);
  }

  async updateKitchenItem(
    id: string,
    data: {
      name?: string;
      category?: string;
      freeCount?: number;
      allocatedCount?: number;
      isBought?: boolean;
    }
  ) {
    return this.request('PUT', `/api/kitchen-items/${id}`, data);
  }

  async deleteKitchenItem(id: string) {
    return this.request('DELETE', `/api/kitchen-items/${id}`);
  }

  // ========== Grocery Items API ==========
  async getGroceryItems(category?: string, isBought?: boolean) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isBought !== undefined) params.append('isBought', String(isBought));

    const query = params.toString();
    return this.request('GET', `/api/grocery-items${query ? '?' + query : ''}`);
  }

  async createGroceryItem(data: {
    name: string;
    category: string;
    count?: number;
    isBought?: boolean;
    derivedFromPlanner?: boolean;
  }) {
    return this.request('POST', '/api/grocery-items', data);
  }

  async getGroceryItem(id: string) {
    return this.request('GET', `/api/grocery-items/${id}`);
  }

  async updateGroceryItem(
    id: string,
    data: {
      name?: string;
      category?: string;
      count?: number;
      isBought?: boolean;
    }
  ) {
    return this.request('PUT', `/api/grocery-items/${id}`, data);
  }

  async deleteGroceryItem(id: string) {
    return this.request('DELETE', `/api/grocery-items/${id}`);
  }

  // ========== Friends API ==========
  async getFriends() {
    return this.request<{ id: string; name: string; email: string }[]>('GET', '/api/friends');
  }

  async getFriendInvites() {
    return this.request<
      {
        id: string;
        recipient_email: string;
        status: string;
        sent_at: string;
        accepted_at?: string | null;
      }[]
    >('GET', '/api/friend-invites');
  }

  async createFriendInvites(emails: string[]) {
    return this.request<{
      invites: {
        id: string;
        recipient_email: string;
        status: string;
        sent_at: string;
        accepted_at?: string | null;
      }[];
      matchedUsers: string[];
    }>('POST', '/api/friend-invites', { emails });
  }

  // ========== Planner Groups API ==========
  async getPlannerGroups() {
    return this.request<
      {
        id: string;
        name: string;
        memberIds: string[];
        memberNamesPreview?: string[];
      }[]
    >('GET', '/api/planner-groups');
  }

  async createPlannerGroup(name: string, memberUserIds: string[]) {
    return this.request<{
      id: string;
      name: string;
      memberIds: string[];
      memberNamesPreview?: string[];
    }>('POST', '/api/planner-groups', { name, memberUserIds });
  }

  async updatePlannerGroup(id: string, name: string, memberUserIds: string[]) {
    return this.request<{
      id: string;
      name: string;
      memberIds: string[];
      memberNamesPreview?: string[];
    }>('PUT', `/api/planner-groups/${id}`, { name, memberUserIds });
  }
}

export const api = new MealPlannerApi(
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
);
