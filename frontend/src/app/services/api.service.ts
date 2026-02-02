import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private headers = new HttpHeaders({
    'X-AURA-KEY': 'sk_aura_internal_v1_xyz789'
  });

  constructor(private http: HttpClient) {}

  // Discovery
  resolveDomain(identifier: string, secret: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resolve/${identifier}`, { 
      headers: new HttpHeaders({ 'X-AURA-SECRET': secret }) 
    });
  }

  // Products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers: this.headers });
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data, { headers: this.headers });
  }

  // Plans
  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/plans`, { headers: this.headers });
  }

  createPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/plans`, data, { headers: this.headers });
  }

  // Subscriptions
  getSubscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subscriptions`, { headers: this.headers });
  }

  createSubscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscriptions`, data, { headers: this.headers });
  }

  // Tenants
  getTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tenants`, { headers: this.headers });
  }

  createTenant(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tenants`, data, { headers: this.headers });
  }

  // Infra
  getInfraConfigs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/infra/configs`, { headers: this.headers });
  }

  saveInfraConfig(data: { tenantId: number; productId: number; dbUrl: string; dbToken: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/infra/config`, data, { headers: this.headers });
  }

  testInfraConnection(data: { dbUrl: string; dbToken: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/infra/test-connection`, data, { headers: this.headers });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/infra/stats`, { headers: this.headers });
  }
}
