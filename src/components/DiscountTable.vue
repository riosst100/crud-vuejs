<script setup lang="ts">
import { ref, computed } from 'vue'
import '@material/web/checkbox/checkbox.js'
import '@material/web/iconbutton/icon-button.js'

const props = defineProps<{
  discounts: {
    _id: string
    name: string
    type: 'percent' | 'rupiah'
    value: number
    createdAt: string
  }[]
  selectedIds: string[]
  searchDiscounts: {
    _id: string
    name: string
    type: 'percent' | 'rupiah'
    value: number
    createdAt: string
  }[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string, name: string): void
  (e: 'toggle-all', checked: boolean): void
  (e: 'open-dialog', discount: any): void
}>()

const tableData = computed(() => {
  if (props.searchDiscounts.length >= 0 && props.searchDiscounts !== props.discounts) {
    return props.searchDiscounts
  }

  return props.discounts
})

const newestId = computed<string | null>(() => {
  const data = tableData.value
  if (data.length === 0) return null

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )

  const newest = sorted[0]
  return newest ? newest._id : null
})


const formatValue = (d: any) =>
  d.value == null
    ? '-'
    : d.type === 'percent'
      ? `${d.value}%`
      : `Rp ${Number(d.value).toLocaleString('id-ID')}`

const currentPage = ref(1)
const perPage = ref(10)

const totalPages = computed(() =>
  Math.ceil(tableData.value.length / perPage.value)
)

const paginatedDiscounts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return tableData.value.slice(start, start + perPage.value)
})
</script>
<template>
    <div class="table-wrapper">
        <table class="discount-table">
            <thead>
                <tr>
                    <th class="th-checkbox">
                    <md-checkbox
                        :checked="props.selectedIds.length === tableData.length && tableData.length > 0"
                        :indeterminate="
                            props.selectedIds.length > 0 &&
                            props.selectedIds.length < tableData.length
                        "
                        @change="$emit('toggle-all', $event.target.checked)"
                    />
                    </th>
                    <th>Nama Diskon <img src="/up-arrow-icon.svg" class="up-arrow-icon"/></th>
                    <th>Nilai Diskon <img src="/up-down-arrow.svg" class="up-down-arrow-icon"/></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <!-- NO RESULT -->
                <tr v-if="paginatedDiscounts.length === 0">
                    <td colspan="4" class="no-result">
                    Tidak ditemukan data yang cocok
                    </td>
                </tr>
                <!-- RESULT -->
                <tr v-for="d in paginatedDiscounts" :key="d._id">
                    <td>
                        <md-checkbox
                            :checked="props.selectedIds.includes(d._id)"
                            @change="$emit('toggle', d._id, d.name)"
                        />
                    </td>
                    <td>
                        {{ d.name }}
                        <span v-if="newestId && d._id === newestId" class="badge">baru</span>
                    </td>
                    <td>{{ formatValue(d) }}</td>
                    <td class="action-cell">
                        <md-icon-button @click="$emit('open-dialog', d)">
                            <img src="/icon-edit.svg" class="icon-edit"/>
                        </md-icon-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Pagination -->
    <div class="pagination-wrapper">
        <div class="per-page">
            <select v-model="perPage" @change="currentPage = 1">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
            </select>
            <span>data per halaman</span>
        </div>
        <div class="pagination">
            <md-icon-button
                :disabled="currentPage === 1"
                @click="currentPage--">
            ‹
            </md-icon-button>
            <button
                v-for="p in totalPages"
                :key="p"
                class="page"
                :class="{ active: p === currentPage }"
                @click="currentPage = p"
            >{{ p }}</button>
            <md-icon-button
                :disabled="currentPage === totalPages"
                @click="currentPage++">
            ›
            </md-icon-button>
        </div>
    </div>
</template>
<style scoped>
    md-checkbox {
        --md-checkbox-outline-color: #869098;
    }
    .no-result {
        text-align:center; 
        padding: 15px !important; 
        color:#869098;
    }
    .pagination-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0px;
    }
    .per-page {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12px;
    }
    .per-page select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #CDD2D5;
        background: #fff;
        font-size: 12px;
    }
    .pagination {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .page {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        font-size: 12px;
        cursor: pointer;
        color: #4B5258;
    }
    .page:hover {
        background: #F0F1F2;
    }
    .page.active {
        background: var(--md-sys-color-primary);
        color: white;
        font-weight: 500;
    }
    .up-arrow-icon {
        width: 8px;
        margin-left: 5px;
    }
    .up-down-arrow-icon {
        width: 7px;
        margin-left: 5px;
    }
    .icon-edit {
        width: 13px;
    }
    .th-checkbox {
        width: 10px;
    }
    .table-wrapper {
        border: 1px solid #ECEDEF;
        border-radius: 12px;
        overflow: hidden;
    }
    .discount-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
    }
    .discount-table thead {
        background: #F9FAFA;
    }
    .discount-table th {
        text-align: left;
        padding: 12px;
        font-weight: 600;
        color: #4B5258;
        border-bottom: 2px solid #ECEDEF;
    }
    .discount-table td {
        padding: 5px 12px;
        border-bottom: 1px solid #ECEDEF;
    }
    .discount-table tbody tr:hover {
        background: #F9FAFB;
    }
    /* Badge baru */
    .badge {
        background: #EBF6FF;
        color: #0490F4;
        border: 1px solid #9AE4FD;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        font-weight: 500;
    }
    .action-cell {
        text-align: right;
    }
</style>