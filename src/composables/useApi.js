import { ref } from 'vue';
import axios from 'axios';

export function useApi(endpoint) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
    
      const url = `/api/${endpoint}.json`;
      console.log(`Requesting MOCK data from: ${url}`);
      
     
      await new Promise(res => setTimeout(res, 500));

      const response = await axios.get(url);
      data.value = response.data;

    } catch (e) {
      console.error(`Ошибка при загрузке локальных данных (${endpoint}.json):`, e);
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchData
  };
}
