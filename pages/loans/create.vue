<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-200 mb-6">Nuevo Préstamo</h1>

    <form @submit.prevent="handleSubmit" class="bg-dark-surface rounded-lg shadow-lg p-6 space-y-6">
      <!-- Campos del formulario -->
      <div class="space-y-4">
        <!-- Usuario de Discord -->
        <div>
          <label class="block text-gray-300 mb-2" for="discord">Discord</label>
          <input
            id="discord"
            v-model="loan.discord"
            type="text"
            required
            class="w-full bg-dark-background text-gray-300 p-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
            placeholder="Usuario#1234"
          />
        </div>

        <!-- Wallet -->
        <div>
          <label class="block text-gray-300 mb-2" for="wallet">Wallet</label>
          <input
            id="wallet"
            v-model="loan.wallet"
            type="text"
            required
            class="w-full bg-dark-background text-gray-300 p-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
            placeholder="0x..."
          />
        </div>

        <!-- Monto inicial -->
        <div>
          <label class="block text-gray-300 mb-2" for="montoInicial">Monto Inicial</label>
          <input
            id="montoInicial"
            v-model="loan.montoInicial"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full bg-dark-background text-gray-300 p-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <!-- Fecha del préstamo -->
        <div>
          <label class="block text-gray-300 mb-2" for="fechaPrestamo">Fecha</label>
          <input
            id="fechaPrestamo"
            v-model="loan.fechaPrestamo"
            type="date"
            required
            class="w-full bg-dark-background text-gray-300 p-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-gray-300 mb-2" for="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            v-model="loan.observaciones"
            rows="3"
            class="w-full bg-dark-background text-gray-300 p-3 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <!-- Resumen -->
      <div class="bg-dark-background p-4 rounded-lg space-y-2">
        <div class="flex justify-between text-gray-300">
          <span>Interés Diario:</span>
          <span>0.5%</span>
        </div>
        <div class="flex justify-between text-gray-300">
          <span>Monto Inicial:</span>
          <span>${{ formatNumber(loan.montoInicial || 0) }}</span>
        </div>
        <div class="flex justify-between text-emerald-400 font-bold">
          <span>Total a Pagar (1 día):</span>
          <span>${{ formatNumber((loan.montoInicial || 0) * 1.005) }}</span>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-4">
        <NuxtLink to="/loans" class="px-4 py-2 text-gray-300 hover:text-white transition-colors">
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
        >
          Crear Préstamo
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loan = ref({
  discord: '',
  wallet: '',
  montoInicial: 0,
  fechaPrestamo: '',
  observaciones: '',
  estado: 'ACTIVO'
})

const formatNumber = (number) => {
  return Number(number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleSubmit = async () => {
  try {
    if (!loan.value.discord || !loan.value.wallet || !loan.value.montoInicial || !loan.value.fechaPrestamo) {
      throw new Error('Por favor, complete todos los campos obligatorios.')
    }

    const response = await fetch('https://apiloan-zkmh.onrender.com/api/loan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loan.value),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear el préstamo.')
    }

    router.push('/loans')
  } catch (error) {
    console.error('Error al crear el préstamo:', error)
    alert(error.message)
  }
}
</script>
