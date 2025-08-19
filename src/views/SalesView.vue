<template>
  <div class="sales-view">
    <h1>Страница "Продажи" (Sales)</h1>

    <div class="filters-container">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Поиск по названию товара..."
      />
    </div>

    <div v-if="loading">Загрузка данных...</div>
    <div v-if="error" class="error">Произошла ошибка: {{ error.message }}</div>

    <div v-if="filteredData" class="content-grid">
      <div class="chart-container">
        <h2>Общая стоимость продаж по товарам</h2>
        <BarChart v-if="salesChartData" :chart-data="salesChartData" />
      </div>

      <div class="table-container">
        <div class="table-header">
          <h2>Детали продаж</h2> 
          <span v-if="paginatedData.length > 0">
            Страница {{ currentPage }} из {{ totalPages }}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID Продажи</th>
              <th>Дата</th>
              <th>Товар</th>
              <th>Кол-во</th>
              <th>Цена</th>
              <th>Сумма</th>
              <th>Склад</th>
            </tr>
          </thead>
          <tbody>
         
            <tr v-for="sale in paginatedData" :key="sale.saleID">
              <td>{{ sale.saleID }}</td>
              <td>{{ new Date(sale.date).toLocaleString('ru-RU') }}</td>
              <td>{{ sale.product }}</td>
              <td>{{ sale.quantity }}</td>
              <td>{{ sale.price.toLocaleString('ru-RU') }} ₽</td>
              <td>{{ sale.totalPrice.toLocaleString('ru-RU') }} ₽</td>
              <td>{{ sale.warehouseName }}</td>
            </tr>
          </tbody>
        </table>
      
        <div v-if="totalPages > 1" class="pagination-container">
          <button @click="prevPage" :disabled="currentPage === 1">
            &laquo; Назад
          </button>
          <span>Страница {{ currentPage }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            Вперед &raquo;
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useApi } from '@/composables/useApi.js';
import BarChart from '@/components/BarChart.vue';

const { data, loading, error, fetchData } = useApi('sales');


const searchTerm = ref('');


const currentPage = ref(1);
const itemsPerPage = ref(5); 

// --- Computed Properties ---

const filteredData = computed(() => {
  if (!data.value) return [];
  if (!searchTerm.value) return data.value;
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  return data.value.filter(sale => 
    sale.product.toLowerCase().includes(lowerCaseSearch)
  );
});


const totalPages = computed(() => {
  if (!filteredData.value) return 0;
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});


const paginatedData = computed(() => {
  if (!filteredData.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const salesChartData = computed(() => {
 
  if (!filteredData.value || filteredData.value.length === 0) return null;

  const salesByProduct = filteredData.value.reduce((acc, sale) => {
    if (!acc[sale.product]) acc[sale.product] = 0;
    acc[sale.product] += sale.totalPrice;
    return acc;
  }, {});

  const labels = Object.keys(salesByProduct);
  const values = Object.values(salesByProduct);

  return {
    labels: labels,
    datasets: [{ label: 'Общая сумма продаж (₽)', backgroundColor: '#42b983', data: values }]
  };
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}


watch(filteredData, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>

.sales-view { padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 1200px; margin: 0 auto; }
.filters-container { background-color: #fff; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
.filters-container input { width: 100%; padding: 10px 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; }
.error { color: #d32f2f; background-color: #ffcdd2; border: 1px solid #d32f2f; padding: 15px; border-radius: 5px; margin-top: 20px; }
.content-grid { display: grid; gap: 30px; }
.chart-container, .table-container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.chart-container {position: relative; height: 40vh;min-height: 350px; }
.table-header { display: flex; justify-content: space-between; align-items: center; }
.table-header span { font-size: 14px; color: #666; }
h2 { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; }
th { background-color: #f2f2f2; color: #333; font-weight: 600; text-transform: uppercase; font-size: 12px; }
tbody tr:nth-child(even) { background-color: #f9f9f9; }
tbody tr:hover { background-color: #f1f1f1; }

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}
.pagination-container button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}
.pagination-container button:hover:not(:disabled) {
  background-color: #f0f0f0;
}
.pagination-container button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination-container span {
  font-size: 14px;
  color: #333;
}
</style>
