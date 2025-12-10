const API_URL = 'http://localhost:3000/api';

export class APIClient {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async checkAuth() {
    try {
      return await this.fetch('/auth/me');
    } catch (error) {
      return null;
    }
  }
  
  async logout() {
    return this.fetch('/auth/logout', { method: 'POST' });
  }
  
  async getNetworks() {
    return this.fetch('/network');
  }
  
  async getNetwork(id: string) {
    return this.fetch(`/network/${id}`);
  }
  
  async createNetwork(name: string) {
    return this.fetch('/network', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }
  
  async updateNetworkMoney(id: string, money: number) {
    return this.fetch(`/network/${id}/money`, {
      method: 'PATCH',
      body: JSON.stringify({ money })
    });
  }
  
  async createStation(data: {
    networkId: string;
    name: string;
    x: number;
    y: number;
    cost: number;
  }) {
    return this.fetch('/station', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async deleteStation(id: string) {
    return this.fetch(`/station/${id}`, {
      method: 'DELETE'
    });
  }
  
  async createLine(data: {
    networkId: string;
    name: string;
    color: string;
    type?: string;
  }) {
    return this.fetch('/line', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async addStationToLine(lineId: string, stationId: string) {
    return this.fetch(`/line/${lineId}/stations`, {
      method: 'POST',
      body: JSON.stringify({ stationId })
    });
  }
  
  async deleteLine(id: string) {
    return this.fetch(`/line/${id}`, {
      method: 'DELETE'
    });
  }
}

