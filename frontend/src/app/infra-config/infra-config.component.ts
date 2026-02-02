import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-infra-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white italic tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Infraestructura Turso</h2>
          <p class="text-slate-400 text-xs uppercase tracking-widest font-black mt-2">Configuración y Blindaje de Bases de Datos</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Configuration Form -->
        <div class="lg:col-span-1 bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 backdrop-blur-sm">
          <h3 class="text-sm font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-4">Nueva Conexión</h3>
          
          <div class="space-y-4 text-sm">
            <div>
              <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Empresa (Tenant)</label>
              <select [(ngModel)]="config.tenantId" class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 focus:ring-2 ring-indigo-500 transition-all outline-none">
                <option [value]="0" disabled>Seleccionar Empresa</option>
                @for (t of tenants(); track t.id) {
                  <option [value]="t.id">{{ t.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Producto SaaS</label>
              <select [(ngModel)]="config.productId" class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 focus:ring-2 ring-indigo-500 transition-all outline-none">
                <option [value]="0" disabled>Seleccionar Producto</option>
                @for (p of products(); track p.id) {
                  <option [value]="p.id">{{ p.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Turso DB URL</label>
              <input [(ngModel)]="config.dbUrl" type="text" placeholder="libsql://fortex-operate.turso.io" 
                class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 font-mono text-xs outline-none focus:ring-2 ring-indigo-500 transition-all">
            </div>
            <div>
              <label class="block mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Turso Auth Token</label>
              <div class="relative">
                <input [(ngModel)]="config.dbToken" [type]="showToken() ? 'text' : 'password'" placeholder="eyJhbG..." 
                  class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 font-mono text-xs pr-12 outline-none focus:ring-2 ring-indigo-500 transition-all">
                <button (click)="showToken.set(!showToken())" class="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">
                  <i [class]="showToken() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button (click)="testConnection()" [disabled]="testing()" 
              class="w-full px-4 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-700 disabled:opacity-50">
              <i class="pi pi-bolt mr-2" [class.animate-pulse]="testing()"></i>
              {{ testing() ? 'Probando...' : 'Test Connection' }}
            </button>
            <button (click)="saveConfig()" 
              class="w-full px-4 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
               Guardar Blindaje
            </button>
          </div>

          @if (testResult()) {
            <div [class]="'p-4 rounded-xl text-xs border animate-in slide-in-from-top-2 ' + (testResult()?.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400')">
              <div class="flex items-center gap-2 font-black mb-1">
                <i [class]="testResult()?.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                {{ testResult()?.success ? 'CONEXIÓN EXITOSA' : 'FALLA DE COMUNICACIÓN' }}
              </div>
              <p class="opacity-80 font-mono">{{ testResult()?.message }}</p>
            </div>
          }
        </div>

        <!-- Infrastructure List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl">
             <div class="flex items-center gap-3">
               <div class="p-2 bg-indigo-500/20 rounded-lg"><i class="pi pi-shield text-indigo-400"></i></div>
               <div>
                  <h4 class="text-white font-bold text-xs uppercase tracking-widest">Estado del Blindaje</h4>
                  <p class="text-slate-500 text-[10px]">Todas las claves de Turso están cifradas con AES-256-GCM.</p>
               </div>
             </div>
          </div>
          
          <div class="bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm overflow-hidden text-sm">
            <div class="p-4 bg-indigo-500/5 border-b border-slate-800">
               <h4 class="text-slate-400 font-black uppercase text-[10px] tracking-widest">Conexiones Activas</h4>
            </div>
            <table class="w-full text-left">
              <thead class="bg-slate-900/50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th class="p-4">Empresa / Producto</th>
                  <th class="p-4">Base de Datos (Turso)</th>
                  <th class="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                @for (c of configs(); track c.id) {
                  <tr class="hover:bg-white/5 transition-all">
                    <td class="p-4">
                      <div class="flex flex-col">
                        <span class="text-white font-bold uppercase tracking-tight">{{ c.tenant?.name || 'ID:' + c.tenantId }}</span>
                        <span class="text-indigo-400 text-[10px] font-mono">{{ c.product?.name || 'ID:' + c.productId }}</span>
                      </div>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-database text-slate-600 text-[10px]"></i>
                        <code class="text-slate-400 font-mono text-[10px]">{{ c.dbUrl }}</code>
                      </div>
                    </td>
                    <td class="p-4 text-right">
                       <button class="p-2 text-slate-500 hover:text-white transition-colors" title="Editar">
                         <i class="pi pi-pencil"></i>
                       </button>
                       <button class="p-2 text-rose-500 hover:bg-rose-500/10 rounded ml-2 transition-all">
                         <i class="pi pi-trash"></i>
                       </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            
            @if (configs().length === 0) {
              <div class="p-16 text-center text-slate-600 font-light text-sm italic">
                <i class="pi pi-inbox text-4xl mb-4 block opacity-10"></i>
                No hay infraestructuras configuradas para fortex.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class InfraConfigComponent implements OnInit {
  private api = inject(ApiService);
  
  tenants = signal<any[]>([]);
  products = signal<any[]>([]);
  configs = signal<any[]>([]);
  testing = signal(false);
  testResult = signal<any>(null);
  showToken = signal(false);
  
  config = {
    tenantId: 0,
    productId: 0,
    dbUrl: '',
    dbToken: ''
  };

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.api.getTenants().subscribe(res => {
      this.tenants.set(res);
      if (res.length > 0 && this.config.tenantId === 0) this.config.tenantId = res[0].id;
    });
    this.api.getProducts().subscribe(res => {
      this.products.set(res);
      if (res.length > 0 && this.config.productId === 0) this.config.productId = res[0].id;
    });
    this.api.getInfraConfigs().subscribe(res => this.configs.set(res));
  }

  testConnection() {
    this.testing.set(true);
    this.testResult.set(null);
    this.api.testInfraConnection({ dbUrl: this.config.dbUrl, dbToken: this.config.dbToken })
      .subscribe({
        next: (res) => {
          this.testResult.set(res);
          this.testing.set(false);
        },
        error: (err) => {
          this.testResult.set({ success: false, message: 'Error de red o timeout.' });
          this.testing.set(false);
        }
      });
  }

  saveConfig() {
    if (!this.config.tenantId || !this.config.productId || !this.config.dbUrl || !this.config.dbToken) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.api.saveInfraConfig(this.config).subscribe({
      next: () => {
        this.refreshData();
        this.config = { ...this.config, dbToken: '', dbUrl: '' }; // Limpiar sensibles
        this.testResult.set(null);
        alert('Blindaje de infraestructura completado con éxito.');
      },
      error: (err) => alert('Error al guardar: ' + err.message)
    });
  }
}
