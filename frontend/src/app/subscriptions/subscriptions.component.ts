import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white italic tracking-tight">Estrategia de Negocio (Fortex)</h2>
          <p class="text-slate-400 text-xs uppercase tracking-widest font-black">Planes, Facturación y Activación de Clientes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Plans Management -->
        <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 backdrop-blur-sm">
          <div class="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 class="text-lg font-bold text-white italic">Planes de Pago</h3>
            <button (click)="showPlanModal.set(true)" class="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-black uppercase tracking-widest">
              Nuevo Plan
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-4">
            @for (plan of plans(); track plan.id) {
              <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <h4 class="text-white font-bold text-sm uppercase tracking-tight">{{ plan.name }}</h4>
                  </div>
                  <p class="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Producto : {{ plan.product?.name || plan.productId }}</p>
                </div>
                <div class="text-right">
                  <div class="text-indigo-400 font-black text-xl tracking-tighter">
                    {{ (plan.priceCents / 100).toLocaleString('en-US', { style: 'currency', currency: plan.currency || 'USD' }) }}
                  </div>
                  <p class="text-[9px] text-slate-600 font-bold uppercase">Pago Mensual</p>
                </div>
              </div>
            }
            @if (plans().length === 0) {
              <div class="py-12 text-center text-slate-600 italic text-sm">No hay planes configurados.</div>
            }
          </div>
        </div>

        <!-- Subscriptions Status -->
        <div class="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 backdrop-blur-sm">
           <div class="flex justify-between items-center border-b border-slate-800 pb-4">
             <h3 class="text-lg font-bold text-white italic">Suscripciones Activas</h3>
             <button (click)="showSubModal.set(true)" class="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-all font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
               Nueva Suscripción
             </button>
           </div>
           
           <div class="space-y-4">
              @for (sub of subscriptions(); track sub.id) {
                <div class="flex items-center justify-between p-4 bg-slate-800/20 rounded-xl border border-slate-700/30 group hover:bg-slate-800/40 transition-all">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-xs text-indigo-400 shadow-inner">
                      {{ sub.tenant?.name?.substring(0,2).toUpperCase() || '??' }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-white uppercase tracking-tight">{{ sub.tenant?.name || 'Empresa #' + sub.tenantId }}</p>
                      <p class="text-[10px] text-slate-500 font-bold tracking-widest">{{ sub.plan?.name || 'Plan #' + sub.planId }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span [class]="'px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ' + getStatusClass(sub.status)">
                      {{ sub.status }}
                    </span>
                    <p class="text-[9px] text-slate-600 mt-1 font-mono uppercase tracking-tighter">Exp: {{ sub.expiresAt | date:'dd/MM/yy' }}</p>
                  </div>
                </div>
              }
              @if (subscriptions().length === 0) {
                <div class="p-12 text-center text-slate-600 italic font-light text-sm">
                  <i class="pi pi-ticket text-3xl mb-4 block opacity-10"></i>
                  No hay empresas suscritas. Pulsa el botón superior para empezar.
                </div>
              }
           </div>
        </div>
      </div>

      <!-- Plan Modal -->
      @if (showPlanModal()) {
        <div class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-8 transform animate-in zoom-in-95">
            <h3 class="text-xl font-bold text-white mb-6 italic tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Crear Plan Master</h3>
            <div class="space-y-4 text-sm">
              <div>
                <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Producto SaaS</label>
                <select [(ngModel)]="newPlan.productId" class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all">
                  @for (p of products(); track p.id) {
                    <option [value]="p.id">{{ p.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre del Plan</label>
                <input [(ngModel)]="newPlan.name" type="text" placeholder="Ej: Fortex Basic" 
                  class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio (USD/mes)</label>
                  <input [(ngModel)]="newPlan.priceUSD" type="number" placeholder="99.00" 
                    class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all">
                </div>
                <div>
                  <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Moneda</label>
                  <input [(ngModel)]="newPlan.currency" type="text" 
                    class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 font-mono text-center">
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-8">
              <button (click)="showPlanModal.set(false)" class="flex-1 px-4 py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase hover:bg-slate-700 transition-all">Cancelar</button>
              <button (click)="savePlan()" class="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">Guardar Plan</button>
            </div>
          </div>
        </div>
      }

      <!-- New Subscription Modal -->
      @if (showSubModal()) {
        <div class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-8 transform animate-in zoom-in-95">
            <h3 class="text-xl font-bold text-white mb-6 italic tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Nueva Suscripción</h3>
            <p class="text-xs text-slate-400 mb-6 uppercase tracking-widest font-bold">Activa el estatus de la empresa a 'active'</p>
            
            <div class="space-y-4 text-sm">
              <div>
                <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Empresa (Fortex)</label>
                <select [(ngModel)]="newSub.tenantId" class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all">
                  <option [value]="0">Seleccionar Empresa</option>
                  @for (t of tenants(); track t.id) {
                    <option [value]="t.id">{{ t.name }} ({{ t.domain }})</option>
                  }
                </select>
              </div>
              <div>
                <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan de Pago</label>
                <select [(ngModel)]="newSub.planId" class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all">
                  <option [value]="0">Seleccionar Plan</option>
                  @for (p of plans(); track p.id) {
                    <option [value]="p.id">{{ p.name }} - {{ (p.priceCents / 100).toFixed(2) }} {{ p.currency }}</option>
                  }
                </select>
              </div>
            </div>
            
            <div class="flex gap-3 mt-8">
              <button (click)="showSubModal.set(false)" class="flex-1 px-4 py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase transition-all">Cancelar</button>
              <button (click)="saveSubscription()" [disabled]="!newSub.tenantId || !newSub.planId" class="flex-1 px-4 py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-500/20 transition-all">Confirmar Alta</button>
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
export class SubscriptionsComponent implements OnInit {
  private api = inject(ApiService);
  
  plans = signal<any[]>([]);
  subscriptions = signal<any[]>([]);
  products = signal<any[]>([]);
  tenants = signal<any[]>([]);

  showPlanModal = signal(false);
  showSubModal = signal(false);
  
  newPlan = { productId: 0, name: '', priceUSD: 99, currency: 'USD' };
  newSub = { tenantId: 0, planId: 0 };

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.api.getPlans().subscribe(res => this.plans.set(res));
    this.api.getSubscriptions().subscribe(res => this.subscriptions.set(res));
    this.api.getTenants().subscribe(res => this.tenants.set(res));
    this.api.getProducts().subscribe(res => {
      this.products.set(res);
      if (res.length > 0 && this.newPlan.productId === 0) {
        this.newPlan.productId = res[0].id;
      }
    });
  }

  savePlan() {
    this.api.createPlan({
      ...this.newPlan,
      priceCents: Math.round(this.newPlan.priceUSD * 100)
    }).subscribe(() => {
      this.refreshData();
      this.showPlanModal.set(false);
      this.newPlan = { productId: this.products()[0]?.id || 0, name: '', priceUSD: 99, currency: 'USD' };
    });
  }

  saveSubscription() {
    this.api.createSubscription({
        tenantId: Number(this.newSub.tenantId),
        planId: Number(this.newSub.planId),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }).subscribe(() => {
        this.refreshData();
        this.showSubModal.set(false);
        this.newSub = { tenantId: 0, planId: 0 };
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'past_due': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'canceled': return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  }
}
