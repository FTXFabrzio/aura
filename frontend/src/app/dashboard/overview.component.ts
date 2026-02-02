import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 class="text-3xl font-black text-white italic tracking-tight">Dashboard Aura</h2>
        <p class="text-slate-400 mt-1 uppercase tracking-widest text-[10px] font-bold">Estado global del ecosistema Multi-tenant</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats(); track stat.label) {
          <div class="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md hover:border-indigo-500/30 transition-all group">
            <div class="flex justify-between items-start mb-4">
              <div [class]="'p-3 rounded-xl ' + stat.color">
                <i [class]="'pi ' + stat.icon + ' text-lg'"></i>
              </div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">+12% vs mes ant.</span>
            </div>
            <h4 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{{ stat.label }}</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-white">{{ stat.value }}</span>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- DB Health -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-5">
             <i class="pi pi-database text-9xl"></i>
          </div>
          <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Salud de Bases de Datos
          </h3>
          <div class="space-y-6">
            <div class="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                   <i class="pi pi-cloud"></i>
                </div>
                <div>
                  <p class="text-white font-bold text-sm">Turso Master</p>
                  <p class="text-[10px] text-slate-500 font-mono">aura-fortex.turso.io</p>
                </div>
              </div>
              <span class="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-full">Operativo</span>
            </div>
            <p class="text-slate-500 text-xs italic">"Todas las bases de datos de los tenants están respondiendo dentro del umbral de 200ms."</p>
          </div>
        </div>

        <!-- Recent Activity Placeholder -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <h3 class="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-3 hover:bg-slate-800/30 rounded-xl transition-all cursor-default group">
              <div class="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-all"></div>
              <div class="flex-1">
                <p class="text-slate-300 text-sm"><span class="text-white font-bold">Htl Elevadores</span> registró un nuevo dominio.</p>
                <p class="text-[10px] text-slate-500 uppercase font-black">Hace 15 minutos</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 hover:bg-slate-800/30 rounded-xl transition-all cursor-default group">
              <div class="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-all"></div>
              <div class="flex-1">
                <p class="text-slate-300 text-sm"><span class="text-white font-bold">Operate</span> actualizó configuración infra.</p>
                <p class="text-[10px] text-slate-500 uppercase font-black">Hace 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class OverviewComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<any[]>([]);

  ngOnInit() {
    this.api.getStats().subscribe(data => {
      this.stats.set([
        { label: 'Empresas', value: data.tenants, icon: 'pi-briefcase', color: 'bg-indigo-500/10 text-indigo-400' },
        { label: 'Infra Configs', value: data.infraConfigs, icon: 'pi-cog', color: 'bg-tokyo-purple/10 text-tokyo-purple' },
        { label: 'Suscripciones', value: 0, icon: 'pi-ticket', color: 'bg-tokyo-green/10 text-tokyo-green' },
      ]);
    });
  }

}
