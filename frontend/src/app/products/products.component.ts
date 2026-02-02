import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white">Productos SaaS</h2>
          <p class="text-slate-400">Gestiona tus aplicaciones y sus claves de acceso.</p>
        </div>
        <button (click)="showModal.set(true)" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20">
          Nuevo Producto
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of products(); track product.id) {
          <div class="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-indigo-500/10 rounded-xl">
                <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span class="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md font-mono">{{ product.slug }}</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ product.name }}</h3>
            <div class="space-y-3">
              <div>
                <label class="text-xs text-slate-500 uppercase tracking-wider">Aura Secret Key</label>
                <div class="flex items-center gap-2 mt-1">
                  <input type="password" [value]="product.apiKeySecret" readonly 
                    class="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg block w-full p-2 font-mono">
                  <button class="p-2 text-slate-400 hover:text-white transition-colors" title="Copiar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-8">
            <h3 class="text-xl font-bold text-white mb-6">Nuevo Producto SaaS</h3>
            <div class="space-y-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-slate-300">Nombre</label>
                <input [(ngModel)]="newProduct.name" type="text" placeholder="Ej: Operate Admin" 
                  class="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl block w-full p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-slate-300">Slug (ID único)</label>
                <input [(ngModel)]="newProduct.slug" type="text" placeholder="ej: operate" 
                  class="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl block w-full p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-slate-300">Aura Secret Key</label>
                <input [(ngModel)]="newProduct.apiKeySecret" type="text" placeholder="sk_aura_..." 
                  class="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl block w-full p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono">
              </div>
              <div class="flex gap-3 mt-8">
                <button (click)="showModal.set(false)" class="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">Cancelar</button>
                <button (click)="saveProduct()" class="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ProductsComponent implements OnInit {
  private api = inject(ApiService);
  products = signal<any[]>([]);
  showModal = signal(false);
  newProduct = { name: '', slug: '', apiKeySecret: '' };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.getProducts().subscribe(res => this.products.set(res));
  }

  saveProduct() {
    this.api.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.showModal.set(false);
      this.newProduct = { name: '', slug: '', apiKeySecret: '' };
    });
  }
}
