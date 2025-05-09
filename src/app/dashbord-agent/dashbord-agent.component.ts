import { Component, OnInit } from '@angular/core';
import { DemandeChequierStatService } from '../services/demandeChequierStat.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';

interface StatData {
  total: number;
  enCours?: number;
  enAttente?: number;
  partiellementTraitees?: number;
  traitees: number;
}

@Component({
  selector: 'app-dashbord-agent',
  templateUrl: './dashbord-agent.component.html',
  styleUrls: ['./dashbord-agent.component.scss'],
})
export class DashbordAgentComponent implements OnInit {
  currentDate = new Date();
  chequierStats: StatData | null = null;
  decouvertStats: StatData | null = null;
  reclamationStats: StatData | null = null;
  kycStats: StatData | null = null;





  public barChartDataKYC: ChartConfiguration<'bar'>['data'] = {
    labels: ['Total', 'En Cours', 'Traitées'],
    datasets: []
  };
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
    datasets: []
  };

  public barChartDataChequier: ChartConfiguration<'bar'>['data'] = {
    labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
    datasets: []
  };

  public barChartDataDecouvert: ChartConfiguration<'bar'>['data'] = {
    labels: ['Total', 'En Attente', 'Partiellement Traitées', 'Traitées'],
    datasets: []
  };

  public barChartDataReclamation: ChartConfiguration<'bar'>['data'] = {
    labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
    datasets: []
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Chéquiers', 'Découverts', 'Réclamations','kyc'],
    datasets: [{
      data: [0, 0, 0,0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        '#28a745',
        'rgba(255, 99, 132, 1)'
      ],
      hoverBackgroundColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        '#28a745',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        '#28a745',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.raw as number)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: v => Number(v).toFixed(0)
        },
        grid: { drawBorder: false }
      },
      x: { grid: { display: false } }
    }
  };

  public singleChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.raw as number)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: v => Number(v).toFixed(0)
        },
        grid: { drawBorder: false }
      },
      x: { grid: { display: false } }
    }
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: ctx => {
            const label = ctx.label || '';
            const value = Math.round(ctx.raw as number);
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${pct}%)`;
          }
        }
      }
    }
  };

  constructor(private statsService: DemandeChequierStatService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      chequier: this.statsService.getStatistiquesDemandeChequier(),
      decouvert: this.statsService.getStatsDecouvert(),
      reclamation: this.statsService.getStatsReclamation(),
      kyc: this.statsService.getStatsKYC()
    }).subscribe({
      next: ({ chequier, decouvert, reclamation ,kyc}) => {
        this.chequierStats = chequier;
        this.decouvertStats = decouvert;
        this.reclamationStats = reclamation;
        this.kycStats = kyc;

        // helper
        const val = (n?: number) => n ?? 0;

        this.pieChartData = {
          labels: ['Chéquiers', 'Découverts', 'Réclamations','KYC'],
          datasets: [{
            data: [ val(chequier?.total), val(decouvert?.total), val(reclamation?.total) , val(kyc?.total)],
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              '#28a745',
              'rgba(235, 45, 156, 0.7)'
            ],
            hoverBackgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              '#28a745',
              'rgba(235, 45, 156, 1)'

            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              '#28a745',
              'rgba(235, 45, 156, 1)'

            ],
            borderWidth: 1
          }]
        };

        this.barChartData = {
          labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
          datasets: [
            {
              label: 'Chéquiers',
              data: [ val(chequier?.total), val(chequier?.enCours), val(chequier?.partiellementTraitees), val(chequier?.traitees) ],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              minBarLength: 3
            },
            {
              label: 'Découverts',
              data: [ val(decouvert?.total), val(decouvert?.enAttente), 0, val(decouvert?.traitees) ],
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              minBarLength: 3
            },
            {
              label: 'Réclamations',
              data: [ val(reclamation?.total), val(reclamation?.enCours), 0, val(reclamation?.traitees) ],
              backgroundColor: '#28a745',
              borderColor: '#28a745',
              borderWidth: 1,
              minBarLength: 3
            },

            {
              label: 'Modifications KYC',
              data: [
                val(kyc?.total),
                val(kyc?.enAttente),
                0, // Partiellement Traitées (si non applicable)
                val(kyc?.traitees)
              ],
              backgroundColor: 'rgba(153, 102, 255, 0.7)', // Violet pour KYC
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              minBarLength: 3
            }
          ]
        };
        this.barChartDataKYC = {
          labels: ['Total', 'En Cours', 'Traitées'],
          datasets: [{
            label: 'Modifications Fiche KYC',
data: [this.kycStats?.total || 0, this.kycStats?.enCours || 0, this.kycStats?.traitees || 0],            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        };
        this.barChartDataChequier = {
          labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
          datasets: [{
            label: 'Demandes de Chéquiers',
            data: [ val(chequier?.total), val(chequier?.enCours), val(chequier?.partiellementTraitees), val(chequier?.traitees) ],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            minBarLength: 3
          }]
        };

        this.barChartDataDecouvert = {
          labels: ['Total', 'En Attente', 'Partiellement Traitées', 'Traitées'],
          datasets: [{
            label: 'Demandes de Découverts',
            data: [ val(decouvert?.total), val(decouvert?.enAttente), 0, val(decouvert?.traitees) ],
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            minBarLength: 3
          }]
        };

        this.barChartDataReclamation = {
          labels: ['Total', 'En Cours', 'Partiellement Traitées', 'Traitées'],
          datasets: [{
            label: 'Réclamations',
            data: [ val(reclamation?.total), val(reclamation?.enCours), 0, val(reclamation?.traitees) ],
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            borderWidth: 1,
            minBarLength: 3
          }]
        };
      },
      error: err => console.error('Error loading data', err)
    });
  }

  getCompletionPercentage(completed = 0, total = 0): number {
    return total === 0 ? 0 : Math.round(completed / total * 100);
  }

  getStatusClass(stats: StatData | null): string {
    if (!stats) return 'status-neutral';
    const pct = this.getCompletionPercentage(stats.traitees, stats.total);
    if (pct >= 75) return 'status-success';
    if (pct >= 50) return 'status-warning';
    return 'status-danger';
  }

  getStatusText(stats: StatData | null): string {
    if (!stats) return 'Pas de données';
    const pct = this.getCompletionPercentage(stats.traitees, stats.total);
    if (pct >= 75) return 'Bon';
    if (pct >= 50) return 'Moyen';
    return 'Critique';
  }

  refreshData(): void {
    this.loadData();
  }

  exporterDonnees(): void {
    const lignes = [['Type', 'Total', 'Traitées', 'En Cours / En Attente', 'Partiellement Traitées']];
    const fmt = (s: StatData | null) => [
      (s?.total ?? 0).toString(),
      (s?.traitees ?? 0).toString(),
      ((s?.enCours ?? s?.enAttente) ?? 0).toString(),
      (s?.partiellementTraitees ?? 0).toString()
    ];

    lignes.push(['Chéquiers', ...fmt(this.chequierStats)]);
    lignes.push(['Découverts', ...fmt(this.decouvertStats)]);
    lignes.push(['Réclamations', ...fmt(this.reclamationStats)]);
    lignes.push(['Modif. Fiche KYC', ...fmt(this.kycStats)]);

    const csv = lignes.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    link.href = URL.createObjectURL(blob);
    link.download = `statistiques_demandes_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
