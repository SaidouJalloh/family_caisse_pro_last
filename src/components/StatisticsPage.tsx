// // src/components/StatisticsPage.tsx - Intégration avec votre application
// import React, { useState, useEffect } from 'react';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//     PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
// } from 'recharts';
// import {
//     TrendingUp, TrendingDown, Users, Euro, Activity, Calendar,
//     Download, FileText, Filter, RefreshCw, ArrowLeft
// } from 'lucide-react';
// import StatisticsService, { type StatisticsData } from '../lib/statisticsService';

// interface StatisticsPageProps {
//     onBack: () => void;
// }

// // Service PDF amélioré avec plus de fonctionnalités
// class PDFReportGenerator {
//     static async generateReport(data: StatisticsData, type: 'monthly' | 'annual' | 'custom'): Promise<void> {
//         const reportData = await StatisticsService.generateReportData(type);
//         const htmlContent = this.createDetailedReportHTML(reportData);

//         // Créer et télécharger le fichier
//         const blob = new Blob([htmlContent], { type: 'text/html' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `rapport-${type}-${new Date().toISOString().split('T')[0]}.html`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     }

//     private static createDetailedReportHTML(data: StatisticsData & { period: string, type: string }): string {
//         return `
// <!DOCTYPE html>
// <html lang="fr">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Rapport Financier Familial - ${data.period}</title>
//     <style>
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { 
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//             line-height: 1.6; color: #333; background: #f8fafc; padding: 20px; 
//         }
//         .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
//         .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 40px 30px; text-align: center; }
//         .header h1 { font-size: 2.5em; margin-bottom: 10px; }
//         .header p { font-size: 1.2em; opacity: 0.9; }
//         .content { padding: 30px; }
//         .stats-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
//         .stat-card { background: #f8fafc; padding: 25px; border-radius: 10px; text-align: center; border: 2px solid #e2e8f0; transition: all 0.3s; }
//         .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
//         .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
//         .stat-label { color: #64748b; font-size: 0.9em; }
//         .positive { color: #10b981; }
//         .negative { color: #ef4444; }
//         .section { margin-bottom: 40px; }
//         .section-title { font-size: 1.5em; font-weight: bold; margin-bottom: 20px; color: #1e293b; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
//         .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//         .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
//         .table th { background: #f1f5f9; font-weight: 600; }
//         .table tr:hover { background: #f8fafc; }
//         .contributors-list { display: grid; gap: 15px; }
//         .contributor-item { display: flex; justify-content: between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
//         .contributor-name { font-weight: 500; }
//         .contributor-amount { font-weight: bold; color: #4f46e5; }
//         .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; margin-top: 40px; }
//         .summary-box { background: linear-gradient(135deg, #e0e7ff, #f3e8ff); padding: 30px; border-radius: 10px; margin-bottom: 30px; }
//         .summary-title { font-size: 1.3em; font-weight: bold; color: #4f46e5; margin-bottom: 15px; }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- En-tête -->
//         <div class="header">
//             <h1>📊 Rapport Financier Familial</h1>
//             <p>Période: ${data.period} | Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
//         </div>

//         <div class="content">
//             <!-- Résumé exécutif -->
//             <div class="summary-box">
//                 <h2 class="summary-title">Résumé Exécutif</h2>
//                 <p><strong>Solde actuel de la caisse:</strong> ${data.totalCaisse.toFixed(2)}€</p>
//                 <p><strong>Bénéfice net du mois:</strong> <span class="${data.currentMonth.net >= 0 ? 'positive' : 'negative'}">${data.currentMonth.net.toFixed(2)}€</span></p>
//                 <p><strong>Taux de participation:</strong> ${((data.paymentStatus.paid / (data.paymentStatus.paid + data.paymentStatus.partial + data.paymentStatus.unpaid)) * 100).toFixed(1)}%</p>
//             </div>

//             <!-- Statistiques principales -->
//             <div class="section">
//                 <h2 class="section-title">📈 Indicateurs Clés</h2>
//                 <div class="stats-overview">
//                     <div class="stat-card">
//                         <div class="stat-value">${data.totalMembers}</div>
//                         <div class="stat-label">Membres Actifs</div>
//                     </div>
//                     <div class="stat-card">
//                         <div class="stat-value positive">${data.currentMonth.income.toFixed(0)}€</div>
//                         <div class="stat-label">Revenus du Mois</div>
//                     </div>
//                     <div class="stat-card">
//                         <div class="stat-value negative">${data.currentMonth.expenses.toFixed(0)}€</div>
//                         <div class="stat-label">Dépenses du Mois</div>
//                     </div>
//                     <div class="stat-card">
//                         <div class="stat-value">${data.totalPayments}</div>
//                         <div class="stat-label">Transactions Totales</div>
//                     </div>
//                 </div>
//             </div>

//             <!-- Top contributeurs -->
//             <div class="section">
//                 <h2 class="section-title">🏆 Top Contributeurs</h2>
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Rang</th>
//                             <th>Membre</th>
//                             <th>Montant Total</th>
//                             <th>Pourcentage</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.topContributors.map((contributor, index) => `
//                             <tr>
//                                 <td><strong>${index + 1}</strong></td>
//                                 <td>${contributor.name}</td>
//                                 <td class="positive">${contributor.amount.toFixed(2)}€</td>
//                                 <td>${contributor.percentage.toFixed(1)}%</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <!-- Répartition par catégories -->
//             <div class="section">
//                 <h2 class="section-title">📊 Répartition des Revenus</h2>
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Catégorie</th>
//                             <th>Montant</th>
//                             <th>Pourcentage</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.categoryBreakdown.map(category => `
//                             <tr>
//                                 <td>
//                                     <span style="display: inline-block; width: 15px; height: 15px; background: ${category.color}; border-radius: 50%; margin-right: 10px;"></span>
//                                     ${category.category}
//                                 </td>
//                                 <td class="positive">${category.amount.toFixed(2)}€</td>
//                                 <td>${category.percentage.toFixed(1)}%</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <!-- Évolution mensuelle -->
//             <div class="section">
//                 <h2 class="section-title">📈 Évolution sur 6 Mois</h2>
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Mois</th>
//                             <th>Revenus</th>
//                             <th>Dépenses</th>
//                             <th>Net</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.monthlyData.map(month => `
//                             <tr>
//                                 <td><strong>${month.month}</strong></td>
//                                 <td class="positive">${month.income.toFixed(2)}€</td>
//                                 <td class="negative">${month.expenses.toFixed(2)}€</td>
//                                 <td class="${month.net >= 0 ? 'positive' : 'negative'}">${month.net.toFixed(2)}€</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <!-- Soldes des membres -->
//             <div class="section">
//                 <h2 class="section-title">💰 Soldes des Membres</h2>
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Membre</th>
//                             <th>Solde</th>
//                             <th>Statut</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.memberBalances.map(member => `
//                             <tr>
//                                 <td>${member.name}</td>
//                                 <td class="${member.balance >= 0 ? 'positive' : 'negative'}">${member.balance.toFixed(2)}€</td>
//                                 <td>
//                                     <span style="color: ${member.status === 'active' ? '#10b981' : '#ef4444'};">
//                                         ${member.status === 'active' ? 'Actif' : 'Inactif'}
//                                     </span>
//                                 </td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>

//             <!-- Recommandations -->
//             <div class="section">
//                 <h2 class="section-title">💡 Recommandations</h2>
//                 <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 20px;">
//                     ${data.currentMonth.net < 0 ?
//                 '<p><strong>⚠️ Attention:</strong> Le solde net du mois est négatif. Considérez réduire les dépenses ou augmenter les cotisations.</p>' :
//                 '<p><strong>✅ Bonne performance:</strong> Le solde net du mois est positif. Continuez sur cette lancée!</p>'
//             }
//                 </div>

//                 ${data.trends.incomeGrowth < 0 ?
//                 '<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 20px;"><p><strong>📉 Tendance:</strong> Les revenus sont en baisse ce mois-ci. Analysez les causes et mettez en place des actions correctives.</p></div>' :
//                 '<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px;"><p><strong>📈 Tendance positive:</strong> Les revenus sont en hausse. Excellente dynamique!</p></div>'
//             }
//             </div>
//         </div>

//         <!-- Pied de page -->
//         <div class="footer">
//             <p><strong>Caissier Familial Pro</strong> - Rapport généré automatiquement</p>
//             <p>Pour toute question concernant ce rapport, contactez l'administrateur</p>
//             <p style="margin-top: 10px; font-size: 0.9em;">Données à jour au ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
//         </div>
//     </div>
// </body>
// </html>`;
//     }
// }

// const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
//     const [statsData, setStatsData] = useState<StatisticsData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedPeriod, setSelectedPeriod] = useState('current');
//     const [isGeneratingReport, setIsGeneratingReport] = useState(false);

//     useEffect(() => {
//         loadStatistics();
//     }, [selectedPeriod]);

//     const loadStatistics = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const data = await StatisticsService.getCompleteStatistics(selectedPeriod);
//             setStatsData(data);
//         } catch (err) {
//             setError('Erreur lors du chargement des statistiques');
//             console.error('Erreur stats:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGenerateReport = async (type: 'monthly' | 'annual' | 'custom') => {
//         setIsGeneratingReport(true);

//         try {
//             await PDFReportGenerator.generateReport(statsData!, type);
//         } catch (err) {
//             setError('Erreur lors de la génération du rapport');
//             console.error('Erreur rapport:', err);
//         } finally {
//             setIsGeneratingReport(false);
//         }
//     };

//     const handleExportData = async (format: 'json' | 'csv') => {
//         try {
//             const exportedData = await StatisticsService.exportData(format);
//             const blob = new Blob([exportedData], {
//                 type: format === 'json' ? 'application/json' : 'text/csv'
//             });
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `export-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//         } catch (err) {
//             setError('Erreur lors de l\'export');
//             console.error('Erreur export:', err);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
//                     <p className="text-gray-600">Chargement des statistiques...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//                         <X className="h-8 w-8 text-red-600" />
//                     </div>
//                     <h3 className="text-red-800 font-bold text-lg mb-2">Erreur</h3>
//                     <p className="text-red-600 mb-4">{error}</p>
//                     <button
//                         onClick={loadStatistics}
//                         className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                         Réessayer
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (!statsData) return null;

//     const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 rounded-lg ${color}`}>
//                     <Icon className="h-6 w-6 text-white" />
//                 </div>
//                 {trend !== undefined && (
//                     <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
//                         }`}>
//                         {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> :
//                             trend < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
//                         {Math.abs(trend).toFixed(1)}%
//                     </div>
//                 )}
//             </div>
//             <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
//             <div className="text-gray-600 text-sm">{title}</div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <button
//                             onClick={onBack}
//                             className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                             <ArrowLeft className="h-5 w-5 text-gray-600" />
//                         </button>
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Statistiques et Rapports</h1>
//                             <p className="text-gray-600">Analyse détaillée de vos finances familiales</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                         <select
//                             value={selectedPeriod}
//                             onChange={(e) => setSelectedPeriod(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         >
//                             <option value="current">Période actuelle</option>
//                             <option value="last-month">Mois dernier</option>
//                             <option value="current-year">Année actuelle</option>
//                             <option value="custom">Personnalisé</option>
//                         </select>

//                         <button
//                             onClick={loadStatistics}
//                             className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                         >
//                             <RefreshCw className="h-4 w-4 mr-2" />
//                             Actualiser
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-6">
//                 {/* Cartes statistiques */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <StatCard
//                         title="Membres actifs"
//                         value={statsData.totalMembers}
//                         trend={statsData.trends.membersGrowth}
//                         icon={Users}
//                         color="bg-blue-500"
//                     />
//                     <StatCard
//                         title="Solde de la caisse"
//                         value={`${statsData.totalCaisse.toFixed(2)}€`}
//                         trend={undefined}
//                         icon={Euro}
//                         color="bg-green-500"
//                     />
//                     <StatCard
//                         title="Revenus du mois"
//                         value={`${statsData.currentMonth.income.toFixed(2)}€`}
//                         trend={statsData.trends.incomeGrowth}
//                         icon={TrendingUp}
//                         color="bg-indigo-500"
//                     />
//                     <StatCard
//                         title="Dépenses du mois"
//                         value={`${statsData.currentMonth.expenses.toFixed(2)}€`}
//                         trend={statsData.trends.expenseGrowth}
//                         icon={Activity}
//                         color="bg-orange-500"
//                     />
//                 </div>

//                 {/* Graphiques */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
//                     {/* Évolution mensuelle */}
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                             <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
//                             Évolution mensuelle
//                         </h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <AreaChart data={statsData.monthlyData}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis />
//                                 <Tooltip
//                                     formatter={(value: number, name: string) => [`${value.toFixed(2)}€`, name]}
//                                     labelStyle={{ color: '#374151' }}
//                                     contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
//                                 />
//                                 <Area type="monotone" dataKey="income" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} name="Revenus" />
//                                 <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Dépenses" />
//                                 <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} name="Net" />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>

//                     {/* Répartition par catégories */}
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                             <Activity className="h-5 w-5 mr-2 text-indigo-600" />
//                             Répartition par catégories
//                         </h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={statsData.categoryBreakdown}
//                                     cx="50%"
//                                     cy="50%"
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="amount"
//                                     label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
//                                 >
//                                     {statsData.categoryBreakdown.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip formatter={(value: number) => [`${value.toFixed(2)}€`, 'Montant']} />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* Top contributeurs et soldes */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
//                     {/* Top contributeurs */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                         <div className="p-6 border-b border-gray-100">
//                             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                                 <Users className="h-5 w-5 mr-2 text-indigo-600" />
//                                 Top Contributeurs
//                             </h3>
//                         </div>
//                         <div className="p-6">
//                             <div className="space-y-4">
//                                 {statsData.topContributors.map((contributor, index) => (
//                                     <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                                         <div className="flex items-center">
//                                             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mr-3">
//                                                 {index + 1}
//                                             </div>
//                                             <div>
//                                                 <div className="font-medium text-gray-900">{contributor.name}</div>
//                                                 <div className="text-sm text-gray-500">{contributor.percentage.toFixed(1)}% du total</div>
//                                             </div>
//                                         </div>
//                                         <div className="text-lg font-semibold text-indigo-600">
//                                             {contributor.amount.toFixed(2)}€
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Soldes des membres */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                         <div className="p-6 border-b border-gray-100">
//                             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                                 <Euro className="h-5 w-5 mr-2 text-indigo-600" />
//                                 Soldes des Membres
//                             </h3>
//                         </div>
//                         <div className="p-6">
//                             <div className="space-y-3">
//                                 {statsData.memberBalances.map((member, index) => (
//                                     <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                                         <div className="flex items-center">
//                                             <div className={`w-3 h-3 rounded-full mr-3 ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
//                                                 }`}></div>
//                                             <span className="font-medium text-gray-900">{member.name}</span>
//                                         </div>
//                                         <span className={`font-semibold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'
//                                             }`}>
//                                             {member.balance.toFixed(2)}€
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Section génération de rapports */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                     <div className="p-6 border-b border-gray-100">
//                         <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                             <FileText className="h-5 w-5 mr-2 text-indigo-600" />
//                             Génération de Rapports
//                         </h3>
//                         <p className="text-gray-600 mt-1">Générez des rapports détaillés pour vos finances familiales</p>
//                     </div>

//                     <div className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                             <button
//                                 onClick={() => handleGenerateReport('monthly')}
//                                 disabled={isGeneratingReport}
//                                 className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
//                             >
//                                 <div className="text-center">
//                                     <Calendar className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
//                                     <div className="font-semibold text-gray-900 mb-1">Rapport Mensuel</div>
//                                     <div className="text-sm text-gray-500">Synthèse complète du mois</div>
//                                 </div>
//                             </button>

//                             <button
//                                 onClick={() => handleGenerateReport('annual')}
//                                 disabled={isGeneratingReport}
//                                 className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
//                             >
//                                 <div className="text-center">
//                                     <FileText className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
//                                     <div className="font-semibold text-gray-900 mb-1">Rapport Annuel</div>
//                                     <div className="text-sm text-gray-500">Bilan complet de l'année</div>
//                                 </div>
//                             </button>

//                             <button
//                                 onClick={() => handleGenerateReport('custom')}
//                                 disabled={isGeneratingReport}
//                                 className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
//                             >
//                                 <div className="text-center">
//                                     <Download className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
//                                     <div className="font-semibold text-gray-900 mb-1">Rapport Personnalisé</div>
//                                     <div className="text-sm text-gray-500">Critères sur mesure</div>
//                                 </div>
//                             </button>
//                         </div>

//                         {/* Export de données */}
//                         <div className="bg-gray-50 rounded-lg p-4">
//                             <h4 className="font-medium text-gray-900 mb-3">Export des données</h4>
//                             <div className="flex space-x-4">
//                                 <button
//                                     onClick={() => handleExportData('json')}
//                                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                                 >
//                                     <Download className="h-4 w-4 mr-2" />
//                                     JSON
//                                 </button>
//                                 <button
//                                     onClick={() => handleExportData('csv')}
//                                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                                 >
//                                     <Download className="h-4 w-4 mr-2" />
//                                     CSV
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Statut de génération */}
//                         {isGeneratingReport && (
//                             <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                 <div className="flex items-center">
//                                     <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-3" />
//                                     <div>
//                                         <div className="font-medium text-blue-900">Génération en cours...</div>
//                                         <div className="text-sm text-blue-700">Création de votre rapport détaillé</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StatisticsPage;










// code corriger
/// src/components/StatisticsPage.tsx - Version corrigée
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, Euro, Activity, Calendar,
    Download, FileText, Filter, RefreshCw, ArrowLeft, X
} from 'lucide-react';
import StatisticsService, { type StatisticsData } from '../lib/statisticsService';

interface StatisticsPageProps {
    onBack: () => void;
}

// Interface pour les éléments de catégorie
interface CategoryBreakdownItem {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

// Interface pour les props de StatCard
interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

// Service PDF amélioré avec plus de fonctionnalités
class PDFReportGenerator {
    static async generateReport(data: StatisticsData, type: 'monthly' | 'annual' | 'custom'): Promise<void> {
        const reportData = await StatisticsService.generateReportData(type);
        const htmlContent = this.createDetailedReportHTML(reportData);

        // Créer et télécharger le fichier
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-${type}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    private static createDetailedReportHTML(data: StatisticsData & { period: string, type: string }): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Financier Familial - ${data.period}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; color: #333; background: #f8fafc; padding: 20px; 
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .content { padding: 30px; }
        .stats-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #f8fafc; padding: 25px; border-radius: 10px; text-align: center; border: 2px solid #e2e8f0; transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #64748b; font-size: 0.9em; }
        .positive { color: #10b981; }
        .negative { color: #ef4444; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 1.5em; font-weight: bold; margin-bottom: 20px; color: #1e293b; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .table th { background: #f1f5f9; font-weight: 600; }
        .table tr:hover { background: #f8fafc; }
        .contributors-list { display: grid; gap: 15px; }
        .contributor-item { display: flex; justify-content: between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .contributor-name { font-weight: 500; }
        .contributor-amount { font-weight: bold; color: #4f46e5; }
        .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; margin-top: 40px; }
        .summary-box { background: linear-gradient(135deg, #e0e7ff, #f3e8ff); padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .summary-title { font-size: 1.3em; font-weight: bold; color: #4f46e5; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <h1>📊 Rapport Financier Familial</h1>
            <p>Période: ${data.period} | Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div class="content">
            <!-- Résumé exécutif -->
            <div class="summary-box">
                <h2 class="summary-title">Résumé Exécutif</h2>
                <p><strong>Solde actuel de la caisse:</strong> ${data.totalCaisse.toFixed(2)}€</p>
                <p><strong>Bénéfice net du mois:</strong> <span class="${data.currentMonth.net >= 0 ? 'positive' : 'negative'}">${data.currentMonth.net.toFixed(2)}€</span></p>
                <p><strong>Taux de participation:</strong> ${((data.paymentStatus.paid / (data.paymentStatus.paid + data.paymentStatus.partial + data.paymentStatus.unpaid)) * 100).toFixed(1)}%</p>
            </div>

            <!-- Statistiques principales -->
            <div class="section">
                <h2 class="section-title">📈 Indicateurs Clés</h2>
                <div class="stats-overview">
                    <div class="stat-card">
                        <div class="stat-value">${data.totalMembers}</div>
                        <div class="stat-label">Membres Actifs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value positive">${data.currentMonth.income.toFixed(0)}€</div>
                        <div class="stat-label">Revenus du Mois</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value negative">${data.currentMonth.expenses.toFixed(0)}€</div>
                        <div class="stat-label">Dépenses du Mois</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.totalPayments}</div>
                        <div class="stat-label">Transactions Totales</div>
                    </div>
                </div>
            </div>

            <!-- Top contributeurs -->
            <div class="section">
                <h2 class="section-title">🏆 Top Contributeurs</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Membre</th>
                            <th>Montant Total</th>
                            <th>Pourcentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.topContributors.map((contributor, index) => `
                            <tr>
                                <td><strong>${index + 1}</strong></td>
                                <td>${contributor.name}</td>
                                <td class="positive">${contributor.amount.toFixed(2)}€</td>
                                <td>${contributor.percentage.toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Répartition par catégories -->
            <div class="section">
                <h2 class="section-title">📊 Répartition des Revenus</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th>Montant</th>
                            <th>Pourcentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.categoryBreakdown.map(category => `
                            <tr>
                                <td>
                                    <span style="display: inline-block; width: 15px; height: 15px; background: ${category.color}; border-radius: 50%; margin-right: 10px;"></span>
                                    ${category.category}
                                </td>
                                <td class="positive">${category.amount.toFixed(2)}€</td>
                                <td>${category.percentage.toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Évolution mensuelle -->
            <div class="section">
                <h2 class="section-title">📈 Évolution sur 6 Mois</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Mois</th>
                            <th>Revenus</th>
                            <th>Dépenses</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.monthlyData.map(month => `
                            <tr>
                                <td><strong>${month.month}</strong></td>
                                <td class="positive">${month.income.toFixed(2)}€</td>
                                <td class="negative">${month.expenses.toFixed(2)}€</td>
                                <td class="${month.net >= 0 ? 'positive' : 'negative'}">${month.net.toFixed(2)}€</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Soldes des membres -->
            <div class="section">
                <h2 class="section-title">💰 Soldes des Membres</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Membre</th>
                            <th>Solde</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.memberBalances.map(member => `
                            <tr>
                                <td>${member.name}</td>
                                <td class="${member.balance >= 0 ? 'positive' : 'negative'}">${member.balance.toFixed(2)}€</td>
                                <td>
                                    <span style="color: ${member.status === 'active' ? '#10b981' : '#ef4444'};">
                                        ${member.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Recommandations -->
            <div class="section">
                <h2 class="section-title">💡 Recommandations</h2>
                <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 20px;">
                    ${data.currentMonth.net < 0 ?
                '<p><strong>⚠️ Attention:</strong> Le solde net du mois est négatif. Considérez réduire les dépenses ou augmenter les cotisations.</p>' :
                '<p><strong>✅ Bonne performance:</strong> Le solde net du mois est positif. Continuez sur cette lancée!</p>'
            }
                </div>
                
                ${data.trends.incomeGrowth < 0 ?
                '<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 20px;"><p><strong>📉 Tendance:</strong> Les revenus sont en baisse ce mois-ci. Analysez les causes et mettez en place des actions correctives.</p></div>' :
                '<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px;"><p><strong>📈 Tendance positive:</strong> Les revenus sont en hausse. Excellente dynamique!</p></div>'
            }
            </div>
        </div>

        <!-- Pied de page -->
        <div class="footer">
            <p><strong>Caissier Familial Pro</strong> - Rapport généré automatiquement</p>
            <p>Pour toute question concernant ce rapport, contactez l'administrateur</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Données à jour au ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
    </div>
</body>
</html>`;
    }
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
    const [statsData, setStatsData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState('current');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    useEffect(() => {
        loadStatistics();
    }, [selectedPeriod]);

    const loadStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await StatisticsService.getCompleteStatistics(selectedPeriod);
            setStatsData(data);
        } catch (err) {
            setError('Erreur lors du chargement des statistiques');
            console.error('Erreur stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (type: 'monthly' | 'annual' | 'custom') => {
        setIsGeneratingReport(true);

        try {
            await PDFReportGenerator.generateReport(statsData!, type);
        } catch (err) {
            setError('Erreur lors de la génération du rapport');
            console.error('Erreur rapport:', err);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleExportData = async (format: 'json' | 'csv') => {
        try {
            const exportedData = await StatisticsService.exportData(format);
            const blob = new Blob([exportedData], {
                type: format === 'json' ? 'application/json' : 'text/csv'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `export-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Erreur lors de l\'export');
            console.error('Erreur export:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-gray-600">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <X className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-red-800 font-bold text-lg mb-2">Erreur</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadStatistics}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (!statsData) return null;

    const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> :
                            trend < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
                        {Math.abs(trend).toFixed(1)}%
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-gray-600 text-sm">{title}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Statistiques et Rapports</h1>
                            <p className="text-gray-600">Analyse détaillée de vos finances familiales</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="current">Période actuelle</option>
                            <option value="last-month">Mois dernier</option>
                            <option value="current-year">Année actuelle</option>
                            <option value="custom">Personnalisé</option>
                        </select>

                        <button
                            onClick={loadStatistics}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Actualiser
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Cartes statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Membres actifs"
                        value={statsData.totalMembers}
                        trend={statsData.trends.membersGrowth}
                        icon={Users}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Solde de la caisse"
                        value={`${statsData.totalCaisse.toFixed(2)}€`}
                        trend={undefined}
                        icon={Euro}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Revenus du mois"
                        value={`${statsData.currentMonth.income.toFixed(2)}€`}
                        trend={statsData.trends.incomeGrowth}
                        icon={TrendingUp}
                        color="bg-indigo-500"
                    />
                    <StatCard
                        title="Dépenses du mois"
                        value={`${statsData.currentMonth.expenses.toFixed(2)}€`}
                        trend={statsData.trends.expenseGrowth}
                        icon={Activity}
                        color="bg-orange-500"
                    />
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    {/* Évolution mensuelle */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                            Évolution mensuelle
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={statsData.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number, name: string) => [`${value.toFixed(2)}€`, name]}
                                    labelStyle={{ color: '#374151' }}
                                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                />
                                <Area type="monotone" dataKey="income" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} name="Revenus" />
                                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Dépenses" />
                                <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} name="Net" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Répartition par catégories */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                            Répartition par catégories
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statsData.categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="amount"
                                    label={(entry: any) => `${entry.category} (${entry.percentage.toFixed(1)}%)`}
                                >
                                    {statsData.categoryBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}€`, 'Montant']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top contributeurs et soldes */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    {/* Top contributeurs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                                Top Contributeurs
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {statsData.topContributors.map((contributor, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mr-3">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{contributor.name}</div>
                                                <div className="text-sm text-gray-500">{contributor.percentage.toFixed(1)}% du total</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-indigo-600">
                                            {contributor.amount.toFixed(2)}€
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Soldes des membres */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Euro className="h-5 w-5 mr-2 text-indigo-600" />
                                Soldes des Membres
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {statsData.memberBalances.map((member, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}></div>
                                            <span className="font-medium text-gray-900">{member.name}</span>
                                        </div>
                                        <span className={`font-semibold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {member.balance.toFixed(2)}€
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section génération de rapports */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                            Génération de Rapports
                        </h3>
                        <p className="text-gray-600 mt-1">Générez des rapports détaillés pour vos finances familiales</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <button
                                onClick={() => handleGenerateReport('monthly')}
                                disabled={isGeneratingReport}
                                className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="text-center">
                                    <Calendar className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
                                    <div className="font-semibold text-gray-900 mb-1">Rapport Mensuel</div>
                                    <div className="text-sm text-gray-500">Synthèse complète du mois</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleGenerateReport('annual')}
                                disabled={isGeneratingReport}
                                className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="text-center">
                                    <FileText className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
                                    <div className="font-semibold text-gray-900 mb-1">Rapport Annuel</div>
                                    <div className="text-sm text-gray-500">Bilan complet de l'année</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleGenerateReport('custom')}
                                disabled={isGeneratingReport}
                                className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="text-center">
                                    <Download className="h-10 w-10 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3 transition-colors" />
                                    <div className="font-semibold text-gray-900 mb-1">Rapport Personnalisé</div>
                                    <div className="text-sm text-gray-500">Critères sur mesure</div>
                                </div>
                            </button>
                        </div>

                        {/* Export de données */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Export des données</h4>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleExportData('json')}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    JSON
                                </button>
                                <button
                                    onClick={() => handleExportData('csv')}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    CSV
                                </button>
                            </div>
                        </div>

                        {/* Statut de génération */}
                        {isGeneratingReport && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-blue-900">Génération en cours...</div>
                                        <div className="text-sm text-blue-700">Création de votre rapport détaillé</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;