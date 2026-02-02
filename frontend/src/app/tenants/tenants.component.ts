import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white italic tracking-tight">Directorio Ecosistema</h2>
          <p class="text-slate-400 text-xs uppercase tracking-widest font-black">Gestión de Identidades (Clientes)</p>
        </div>
      </div>

      <div class="space-y-6 animate-in fade-in duration-300">
        <div class="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
          <span class="text-slate-400 text-sm">Lista maestra de clientes registrados por identificación única.</span>
          <button (click)="showTenantModal.set(true)" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
            Nueva Empresa
          </button>
        </div>

        <div class="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-indigo-500/5 border-b border-slate-800 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th class="p-4">ID</th>
                <th class="p-4">Nombre Legal</th>
                <th class="p-4">Dominio (@)</th>
                <th class="p-4">Slug (ID)</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              @for (t of tenants(); track t.id) {
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="p-4 text-slate-500 font-mono">#{{ t.id }}</td>
                  <td class="p-4 font-bold text-white">{{ t.name }}</td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                       <i class="pi pi-globe text-indigo-400 text-[10px]"></i>
                       <span class="text-white font-mono text-sm underline decoration-indigo-500/30 decoration-2 underline-offset-4">{{ t.domain }}</span>
                    </div>
                  </td>
                  <td class="p-4"><code class="text-indigo-300 bg-indigo-400/5 px-2 py-0.5 rounded text-[10px]">{{ t.slug }}</code></td>
                  <td class="p-4">
                    <span [class]="'px-2 py-1 rounded-full text-[10px] font-black uppercase ' + getStatusClass(t.status)">
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                     <button class="p-2 text-slate-500 hover:text-white transition-colors" title="Editar">
                       <i class="pi pi-pencil"></i>
                     </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (tenants().length === 0) {
            <div class="p-12 text-center text-slate-500 italic">
              No hay empresas registradas.
            </div>
          }
        </div>
      </div>

      <!-- Modal: Registrar Empresa -->
      @if (showTenantModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-8 transform animate-in zoom-in-95">
            <h3 class="text-xl font-bold text-white mb-6 italic tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">Registrar Empresa</h3>
            <div class="space-y-5">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nombre de la Empresa</label>
                <input [(ngModel)]="newTenant.name" (ngModelChange)="onNameChange($event)" type="text" placeholder="Ej: Fortex Global" 
                  class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 outline-none focus:ring-2 ring-indigo-500 transition-all font-sans text-sm">
              </div>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                   <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Dominio (@ Identificador)</label>
                   <div class="relative group">
                     <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <i class="pi pi-at text-indigo-500 text-xs"></i>
                     </div>
                     <input [(ngModel)]="newTenant.domain" type="text" placeholder="fortex.com" 
                       class="bg-slate-800 border border-slate-700 text-white rounded-xl block w-full p-4 pl-10 outline-none font-mono text-sm focus:ring-2 ring-indigo-500 transition-all">
                   </div>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Slug (ID Interno)</label>
                  <input [(ngModel)]="newTenant.slug" type="text" placeholder="fortex" 
                    class="bg-slate-800 border border-slate-700 text-slate-400 rounded-xl block w-full p-4 outline-none font-mono text-xs focus:ring-2 ring-indigo-500/50 transition-all">
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-8">
              <button (click)="showTenantModal.set(false)" class="flex-1 px-4 py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase transition-all">Cancelar</button>
              <button (click)="saveTenant()" class="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-500/40 transition-all hover:bg-indigo-500">Registrar Cliente</button>
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
export class TenantsComponent implements OnInit {
  private api = inject(ApiService);
  
  tenants = signal<any[]>([]);
  showTenantModal = signal(false);
  newTenant = { name: '', slug: '', domain: '' };

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.api.getTenants().subscribe(res => this.tenants.set(res));
  }

  onNameChange(name: string) {
    const base = name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    this.newTenant.slug = base;
    this.newTenant.domain = base ? `${base}.com` : '';
  }

  saveTenant() {
    this.api.createTenant(this.newTenant).subscribe(() => {
      this.loadTenants();
      this.showTenantModal.set(false);
      this.newTenant = { name: '', slug: '', domain: '' };
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'trial': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'suspended': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  }
}
