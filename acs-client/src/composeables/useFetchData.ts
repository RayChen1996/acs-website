import { ref } from 'vue'

const apiBaseUrl = import.meta.env.VITE_BASE_URL

interface Card {
  id: string
  cardNumber: string
  memberId: string
  status: string
}

export default function useFetchData(resource = '/card', page = 1) {
  const data = ref<Card[]>([])
  const totalPages = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async (pageNum = page) => {
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching data from: ${apiBaseUrl}${resource}?_page=${pageNum}&_limit=10`)
      const response = await fetch(`${apiBaseUrl}${resource}?_page=${pageNum}&_limit=10`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      data.value = (await response.json()) as Card[]
      const totalCount = response.headers.get('X-Total-Count')
      if (totalCount) {
        totalPages.value = Math.ceil(parseInt(totalCount) / 10)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    totalPages,
    loading,
    error,
    fetchData,
  }
}
