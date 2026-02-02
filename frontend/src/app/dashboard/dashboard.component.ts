import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-tokyo-bg text-tokyo-fg flex font-sans">
      <!-- Sidebar -->
      <aside class="w-68 bg-tokyo-bg-alt border-r border-tokyo-gray/20 p-8 hidden md:block relative">
        <div class="flex items-center space-x-3 mb-12">
          <div class="w-10 h-10 bg-tokyo-purple rounded-xl shadow-[0_0_20px_rgba(187,154,247,0.3)] flex items-center justify-center">
            <i class="pi pi-bolt text-tokyo-bg text-xl font-bold"></i>
          </div>
          <h1 class="text-2xl font-black tracking-tighter text-white">
            AURA<span class="text-tokyo-purple">CP</span>
          </h1>
        </div>
        
        <nav class="space-y-1">
          <p class="text-[10px] font-bold text-tokyo-gray uppercase tracking-widest mb-4 px-4">Menú Principal</p>
          
          <a routerLink="/overview" routerLinkActive="bg-tokyo-purple/10 text-tokyo-purple border-l-4 border-tokyo-purple" class="flex items-center space-x-3 py-3 px-4 rounded-r-lg transition-all duration-300 hover:bg-tokyo-purple/5 group">
            <i class="pi pi-home group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Inicio</span>
          </a>
          
          <a routerLink="/products" routerLinkActive="bg-tokyo-purple/10 text-tokyo-purple border-l-4 border-tokyo-purple" class="flex items-center space-x-3 py-3 px-4 rounded-r-lg transition-all duration-300 hover:bg-tokyo-purple/5 group">
            <i class="pi pi-briefcase group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Productos</span>
          </a>

          <a routerLink="/tenants" routerLinkActive="bg-tokyo-purple/10 text-tokyo-purple border-l-4 border-tokyo-purple" class="flex items-center space-x-3 py-3 px-4 rounded-r-lg transition-all duration-300 hover:bg-tokyo-purple/5 group">
            <i class="pi pi-users group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Empresas</span>
          </a>

          <a routerLink="/infra" routerLinkActive="bg-tokyo-purple/10 text-tokyo-purple border-l-4 border-tokyo-purple" class="flex items-center space-x-3 py-3 px-4 rounded-r-lg transition-all duration-300 hover:bg-tokyo-purple/5 group">
            <i class="pi pi-cog group-hover:rotate-45 transition-transform"></i>
            <span class="font-medium">Config. Infra</span>
          </a>

          <a routerLink="/subscriptions" routerLinkActive="bg-tokyo-purple/10 text-tokyo-purple border-l-4 border-tokyo-purple" class="flex items-center space-x-3 py-3 px-4 rounded-r-lg transition-all duration-300 hover:bg-tokyo-purple/5 group">
            <i class="pi pi-ticket group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Suscripciones</span>
          </a>

        </nav>

        <div class="mt-auto absolute bottom-8 left-8 right-8">
           <div class="flex items-center space-x-3 p-3 bg-tokyo-bg rounded-xl border border-tokyo-gray/10">
              <div class="w-8 h-8 rounded-full bg-tokyo-cyan/20 flex items-center justify-center text-tokyo-cyan text-xs font-bold">AC</div>
              <div>
                <p class="text-xs font-bold text-white">Administrador</p>
                <p class="text-[10px] text-tokyo-gray">v2.5.0-tokyo</p>
              </div>
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-tokyo-bg">
        <header class="bg-tokyo-bg/80 backdrop-blur-md sticky top-0 z-50 py-5 px-10 flex justify-between items-center border-b border-tokyo-gray/10">
          <div>
            <h2 class="text-xs font-bold text-tokyo-gray uppercase tracking-widest mb-1">Centro de Control</h2>
            <h3 class="text-xl font-bold text-white tracking-tight italic">Panel de Control Aura</h3>
          </div>
          <div class="flex items-center space-x-6">
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-tokyo-green/10 rounded-full border border-tokyo-green/20">
              <div class="w-2 h-2 rounded-full bg-tokyo-green animate-pulse"></div>
              <span class="text-[10px] font-bold text-tokyo-green uppercase tracking-tighter">Sistema Online</span>
            </div>
            <button class="w-10 h-10 rounded-full bg-tokyo-bg-alt border border-tokyo-gray/20 flex items-center justify-center hover:bg-tokyo-gray/10 transition-colors">
              <i class="pi pi-bell text-tokyo-fg"></i>
            </button>
          </div>
        </header>

        <div class="p-10">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {}
