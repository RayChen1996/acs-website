<template>
  <div class="container mx-auto p-4">
    <div class="hero bg-base-200 rounded-lg mb-6">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold text-primary">卡片管理</h1>
          <p class="py-6">查看和管理所有人員卡片資訊</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="ml-2">載入中...</span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>錯誤：{{ error }}</span>
    </div>

    <div v-else>
      <!-- 統計卡片 -->
      <div class="stats shadow mb-6">
        <div class="stat">
          <div class="stat-title">總卡片數</div>
          <div class="stat-value text-primary">{{ cards.length }}</div>
          <div class="stat-desc">當前頁面顯示</div>
        </div>
        <div class="stat">
          <div class="stat-title">總頁數</div>
          <div class="stat-value text-secondary">{{ totalPages }}</div>
          <div class="stat-desc">共 {{ totalPages }} 頁</div>
        </div>
        <div class="stat">
          <div class="stat-title">當前頁面</div>
          <div class="stat-value text-accent">{{ currentPage }}</div>
          <div class="stat-desc">第 {{ currentPage }} 頁</div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            卡片列表
            <div class="ml-auto">
              <div class="form-control">
                <div class="input-group">
                  <input
                    type="text"
                    placeholder="搜索卡號或會員ID..."
                    class="input input-bordered input-sm w-64"
                    v-model="searchTerm"
                  />
                  <button class="btn btn-square btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </h2>

          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th class="text-center">
                    <label>
                      <input type="checkbox" class="checkbox checkbox-sm" />
                    </label>
                  </th>
                  <th class="text-center">序號</th>
                  <th class="text-center">卡號</th>
                  <th class="text-center">會員ID</th>
                  <th class="text-center">狀態</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(card, index) in cards" :key="card.id || index" class="hover">
                  <td class="text-center">
                    <label>
                      <input type="checkbox" class="checkbox checkbox-sm" />
                    </label>
                  </td>
                  <td class="text-center font-mono">{{ (currentPage - 1) * 10 + index + 1 }}</td>
                  <td class="text-center">
                    <div class="font-mono text-sm bg-base-200 px-2 py-1 rounded">
                      {{ card.cardNumber }}
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="badge badge-outline">{{ card.memberId }}</div>
                  </td>
                  <td class="text-center">
                    <div class="badge" :class="getStatusClass(card.status)">
                      {{ card.status }}
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="dropdown dropdown-end">
                      <div tabindex="0" role="button" class="btn btn-ghost btn-xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </div>
                      <ul
                        tabindex="0"
                        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
                      >
                        <li><a>查看詳情</a></li>
                        <li><a>編輯</a></li>
                        <li><a class="text-error">刪除</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分頁控制 -->
          <div class="flex justify-center items-center mt-6">
            <div class="join">
              <button
                class="join-item btn"
                :class="{ 'btn-disabled': currentPage === 1 }"
                @click="prevPage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                上一頁
              </button>
              <button class="join-item btn btn-primary">第 {{ currentPage }} 頁</button>
              <button
                class="join-item btn"
                :class="{ 'btn-disabled': currentPage === totalPages }"
                @click="nextPage"
              >
                下一頁
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import useFetchData from '@/composeables/useFetchData'

export default defineComponent({
  name: 'card-page',
  setup() {
    const currentPage = ref(1)
    const searchTerm = ref('')
    const { data: cards, loading, totalPages, error, fetchData } = useFetchData('/Cards')

    // 計算過濾後的卡片
    const filteredCards = computed(() => {
      if (!searchTerm.value) return cards.value
      return cards.value.filter(
        (card: { cardNumber: string; memberId: string }) =>
          card.cardNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          card.memberId.toLowerCase().includes(searchTerm.value.toLowerCase()),
      )
    })

    const getStatusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'badge-success'
        case 'inactive':
          return 'badge-error'
        case 'pending':
          return 'badge-warning'
        default:
          return 'badge-neutral'
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchData(currentPage.value)
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchData(currentPage.value)
      }
    }

    onMounted(() => {
      fetchData(currentPage.value)
    })

    return {
      cards: filteredCards,
      loading,
      currentPage,
      totalPages,
      error,
      searchTerm,
      nextPage,
      prevPage,
      getStatusClass,
    }
  },
})
</script>

<style scoped>
/* DaisyUI 樣式已包含所有需要的樣式 */
</style>
