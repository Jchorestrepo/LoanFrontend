<!-- pages/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-dark-surface rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-400">Total Préstamos</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold mt-4">${{ totalLoans }}</p>
      </div>

      <!-- Eliminar esta tarjeta duplicada -->
      
      <div class="bg-dark-surface rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-400">Total Prestado</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <!-- ícono SVG -->
          </svg>
        </div>
        <p class="text-3xl font-bold mt-4">${{ totalLent }}</p>
      </div>
      
      
      <!-- Puedes agregar más tarjetas de estadísticas aquí -->
    </div>


    

    <!-- Wallet Summaries Table -->
    <div class="bg-dark-surface rounded-lg shadow-lg">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Resumen por Wallet</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Wallet</th>
                <th class="pb-3">Activos</th>
                <th class="pb-3">Prestado</th>
                <th class="pb-3">Intereses</th>
                <th class="pb-3">Total</th>

              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="wallet in walletSummaries" :key="wallet._id" class="text-gray-300">
                <td class="py-3">{{ wallet._id }}</td>
                <td class="py-3">{{ wallet.totalLoans }}</td>
                <td class="py-3">${{ wallet.totalAmount }}</td>
                <td class="py-3">${{ wallet.totalInterests }}</td>
                <td class="py-3">${{ wallet.totalInterests + wallet.totalAmount }}</td>

              </tr>
              <!-- ...existing code... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalLoans: 0,
      totalPaidLoans: 0,
      totalActiveLoans: 0,
      totalOverdueLoans: 0,
      totalLent: 0,
      totalInterestsCollected: 0,
      walletSummaries: []
    };
  },
  async mounted() {
    try {
      // ...existing code...
      const response = await fetch('https://apiloan-zkmh.onrender.com/api/loan');
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      // Calcular los totales desde el arreglo de datos
      this.totalLoans = data.length;
      this.totalPaidLoans = data.filter(loan => loan.status === 'Pagado').length;
      this.totalActiveLoans = data.filter(loan => loan.status === 'Activo').length;
      this.totalOverdueLoans = data.filter(loan => loan.status === 'Vencido').length;
      this.totalLent = data.reduce((sum, loan) => sum + Number(loan.montoInicial || 0), 0);
      this.totalInterestsCollected = data.reduce((sum, loan) => sum + Number(loan.abonos || 0), 0);
      
      // Agrupar resúmenes por wallet
      const summaries = {};
      data.forEach(loan => {
        if (!summaries[loan.wallet]) {
          summaries[loan.wallet] = {
            _id: loan.wallet,
            totalLoans: 0,
            totalAmount: 0,
            totalInterests: 0
          };
        }
        summaries[loan.wallet].totalLoans += 1;
        summaries[loan.wallet].totalAmount += Number(loan.montoInicial || 0);
        summaries[loan.wallet].totalInterests += Number(loan.abonos || 0);
      });
      this.walletSummaries = Object.values(summaries);
      
      console.log('Estado actualizado:', {
        totalLoans: this.totalLoans,
        totalPaidLoans: this.totalPaidLoans,
        totalActiveLoans: this.totalActiveLoans,
        totalOverdueLoans: this.totalOverdueLoans,
        totalLent: this.totalLent,
        totalInterestsCollected: this.totalInterestsCollected,
        walletSummaries: this.walletSummaries
      });
    } catch (error) {
      console.log('Error al obtener los datos:', error);
    }
  }
};
</script>