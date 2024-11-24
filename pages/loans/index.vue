<template>
  <!-- Barra de búsqueda y filtros -->
  <div class="mb-6 space-y-4">
    <div class="flex flex-wrap gap-4">
      <!-- Búsqueda -->
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por discord o wallet..."
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
        />
      </div>
      
      <!-- Filtro de Estado -->
      <div class="min-w-[150px]">
        <select
          v-model="statusFilter"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="PAGADO">PAGADO</option>
        </select>
      </div>

      <!-- Filtro de Fecha -->
      <div class="min-w-[150px]">
        <select
          v-model="dateFilter"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">Todas las fechas</option>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>
    </div>

    <!-- Resumen de resultados -->
    <div class="text-sm text-gray-400">
      Mostrando {{ paginatedLoans.length }} de {{ filteredLoans.length }} préstamos
    </div>
  </div>
  <!-- Modal de Detalles -->
  <div v-if="isDetailsModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-200">Detalles del Préstamo</h3>
        <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4 text-gray-300">
        <!-- Información del préstamo -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400">Discord:</p>
            <p>{{ selectedLoan?.discord }}</p>
          </div>
          <div>
            <p class="text-gray-400">Wallet:</p>
            <p class="break-all">{{ selectedLoan?.wallet }}</p>
          </div>
          <div>
            <p class="text-gray-400">Monto Inicial:</p>
            <p>{{ formatNumber(selectedLoan?.montoInicial) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Fecha Préstamo:</p>
            <p>{{ formatLoanDate(selectedLoan?.fechaPrestamo) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Intereses Acumulados:</p>
            <p>{{ formatNumber(calculatedInterest) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Monto Total:</p>
            <p>{{ formatNumber(calculatedTotal) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Estado:</p>
            <span :class="getStatusClass(selectedLoan?.estado)" class="px-2 py-1 rounded-full text-sm">
              {{ selectedLoan?.estado }}
            </span>
          </div>
        </div>

        <!-- Historial de Pagos -->
        <div class="mt-6">
          <h4 class="text-lg font-medium mb-2">Historial de Pagos</h4>
          <div class="max-h-40 overflow-y-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-gray-400">
                  <th class="p-2">Fecha</th>
                  <th class="p-2">Monto</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="(payment, index) in selectedLoan?.pagos" :key="index">
                  <td class="p-2">{{ formatLoanDate(payment.fecha) }}</td>
                  <td class="p-2">{{ formatNumber(payment.monto) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Formulario de Pago -->
        <div class="mt-6">
          <h4 class="text-lg font-medium mb-2">Realizar Abono</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Monto del Abono</label>
              <input 
                v-model.number="newPaymentAmount"
                type="number"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Ingrese el monto"
              />
            </div>
            <!-- Added Payment Date Input -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Fecha del Abono</label>
              <input 
                v-model="paymentDate"
                type="date"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button 
              @click="submitPayment()"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              :disabled="!newPaymentAmount || !paymentDate"
            >
              Confirmar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla Principal -->
  <!-- Tabla Principal -->
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th class="p-4 text-left">Discord</th>
          <th class="p-4 text-left">Wallet</th>
          <th class="p-4 text-left">Prestamo</th>
          <th class="p-4 text-left">Fecha</th>
          <th class="p-4 text-left">Antiguedad</th>
          <th class="p-4 text-left">Int Acumulados</th>
          <th class="p-4 text-left">Monto Total</th>
          <th class="p-4 text-left">Abonos</th>
          <th class="p-4 text-left">Estado</th>
          <th class="p-4 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
        <tr v-for="(loan, index) in paginatedLoans" :key="loan.id" class="text-gray-300 hover:bg-dark-background/50">
          <td class="p-4">{{ truncateText(loan.discord) }}</td>             <!-- Discord -->
          <td class="p-4">
            <span :title="loan.wallet">{{ truncateText(loan.wallet) }}</span><!-- Wallet -->
          </td>
          <td class="p-4">{{ formatNumber(loan.montoInicial) }}</td>        <!-- Monto Inicial -->
          <td class="p-4">{{ formatLoanDate(loan.fechaPrestamo) }}</td>     <!-- Fecha Prestamo -->
          <td class="p-4">{{ getDaysSinceLoan(loan.fechaPrestamo) }}</td>   <!-- Antiguedad -->
          <td class="p-4">{{ formatNumber(calculateInterest(loan)) }}</td>  <!-- int Acumulados -->
          <td class="p-4">{{ formatNumber(calculateTotal(loan)) }}</td>     <!-- Monto TOtal -->
          <td class="p-4">{{ formatNumber(getTotalPayments(loan)) }}</td>   <!-- Abonos -->
          <td class="p-4">
            <span :class="getStatusClass(loan.estado)" class="px-2 py-1 rounded-full text-sm"> <!-- Estado -->
              {{ loan.estado }}
            </span>
          </td>
          <td class="p-4">
            <div class="flex space-x-2">
              <button 
                @click="showDetailsModal(loan)"
                class="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
<!-- Paginación -->
<div class="mt-4 flex justify-between items-center">
    <div class="text-sm text-gray-400">
      Página {{ currentPage }} de {{ totalPages }}
    </div>
    <div class="flex space-x-2">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50"
      >
        Anterior
      </button>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// Estado
const loans = ref([])
const loading = ref(true)
const error = ref(null)
const isDetailsModalVisible = ref(false)
const selectedLoan = ref(null)
const newPaymentAmount = ref(null)
// Added paymentDate state
const paymentDate = ref(null)

// Nuevo estado para filtros y búsqueda
const searchTerm = ref('')
const statusFilter = ref('ACTIVO') // Set default to 'ACTIVO'
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

// Computed properties para filtros
const filteredLoans = computed(() => {
  let filtered = loans.value

  // Filtro de búsqueda
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(loan => 
      loan.discord.toLowerCase().includes(search) ||
      loan.wallet.toLowerCase().includes(search)
    )
  }

  // Filtro de estado
  if (statusFilter.value) {
    filtered = filtered.filter(loan => loan.estado === statusFilter.value)
  }

  // Filtro de fecha
  if (dateFilter.value) {
    const days = parseInt(dateFilter.value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    filtered = filtered.filter(loan => new Date(loan.fechaPrestamo) >= cutoffDate)
  }

  return filtered
})

// Computed properties para paginación
const totalPages = computed(() => 
  Math.ceil(filteredLoans.value.length / itemsPerPage)
)

const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredLoans.value.slice(start, start + itemsPerPage)
})

// Función para truncar texto
const truncateText = (text) => {
  if (!text) return ''
  return text.length > 15 ? `${text.substring(0, 15)}...` : text
}

// Watch para resetear la página cuando cambian los filtros
watch([searchTerm, statusFilter, dateFilter], () => {
  currentPage.value = 1
})
// Computed properties
const calculatedInterest = computed(() => {
  if (!selectedLoan.value) return 0
  return calculateInterest(selectedLoan.value)
})

const calculatedTotal = computed(() => {
  if (!selectedLoan.value) return 0
  return calculateTotal(selectedLoan.value)
})

// Funciones para el modal de detalles
const showDetailsModal = (loan) => {

  selectedLoan.value = loan
  isDetailsModalVisible.value = true


}

const closeDetailsModal = () => {
  isDetailsModalVisible.value = false
  selectedLoan.value = null
  newPaymentAmount.value = null
  paymentDate.value = null // Reset paymentDate
}


// Función para enviar el pago
const submitPayment = async () => {
    if (!selectedLoan.value || !newPaymentAmount.value || !paymentDate.value) {
        ElMessage.error('Por favor ingrese un monto y una fecha válidos');
        return;
    }

    console.log('Fecha seleccionada:', paymentDate.value); // Logging

    try {
        loading.value = true;
        
        // **Enviar la fecha sin conversión a ISO o ajustarla para evitar el desfase**
        const data = {
            payment: {
                monto: Number(newPaymentAmount.value),
                fecha: `${paymentDate.value}T12:00:00Z` // Ajuste la hora a mediodía UTC
            }
        };

        console.log('Enviando pago:', data); // Logging

        // Actualizar la URL para incluir /payment
        const response = await fetch(`https://apiloan-zkmh.onrender.com/api/loan/${selectedLoan.value._id}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Agregar verificación de tipo de respuesta
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("La respuesta del servidor no es JSON válido");
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData); // Logging

        if (!response.ok) {
            throw new Error(responseData.message || 'Error al realizar el pago');
        }

        // Actualizar la lista de préstamos
        await fetchLoans();
        
        ElMessage.success('Pago realizado con éxito');
        closeDetailsModal();

    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });
        ElMessage.error(error.message || 'Error al procesar el pago');
    } finally {
        loading.value = false;
        newPaymentAmount.value = null;
        paymentDate.value = null
    }
};

// Actualizar la función getTotalPayments para usar el nuevo campo abonos
const getTotalPayments = (loan) => {
    return loan.abonos || loan.pagos?.reduce((total, payment) => total + payment.monto, 0) || 0;
};


// Funciones auxiliares
const calculateInterest = (loan) => {
  const days = getDaysSinceLoan(loan.fechaPrestamo)
  return (loan.montoInicial / 200) * days
}

const calculateTotal = (loan) => {
  const totalPayments = getTotalPayments(loan)
  return loan.montoInicial + calculateInterest(loan) - totalPayments
}


// Función para obtener los préstamos desde la API
const fetchLoans = async () => {
    try {
        const response = await fetch('https://apiloan-zkmh.onrender.com/api/loan');
        if (!response.ok) {
            throw new Error('Error al obtener los préstamos');
        }
        loans.value = await response.json();
        console.log('Préstamos:', loans.value); // Logging
    } catch (e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
};


// Formateo y utilidades
const formatNumber = (number) => {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatLoanDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC' // Asegura que se muestre la fecha en UTC
  })
}

const getDaysSinceLoan = (fechaPrestamo) => {
  const now = new Date()
  const loanDate = new Date(fechaPrestamo)
  const diffTime = Math.abs(now - loanDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusClass = (estado) => {
  const classes = {
    'ACTIVO': 'bg-emerald-400/10 text-emerald-400',
    'PAGADO': 'bg-blue-400/10 text-blue-400',
  };
  return classes[estado] || '';
};




// Inicialización
onMounted(() => {
  fetchLoans()
})
</script>