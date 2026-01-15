<script setup lang="ts">
    import { ref, onMounted, computed, watch } from 'vue'
    import DiscountTable from '@/components/DiscountTable.vue'
    import DiscountEmptyState from '@/components/DiscountEmptyState.vue'
    import OutletDropdown from '@/components/OutletDropdown.vue'
    import Footer from '@/components/Footer.vue'
    import DiscountDialog from '@/components/DiscountDialog.vue'
    import DiscountDeleteDialog from '@/components/DiscountDeleteDialog.vue'

    interface Diskon {
        _id: string
        name: string
        type: 'percent' | 'rupiah'
        value: number
        createdAt: string
    }

    const dialogOpen = ref(false)
    const editDiscount = ref<Diskon | null>(null)

    const openDialog = (diskon?: Diskon) => {
        editDiscount.value = diskon ?? null
        dialogOpen.value = true
    }

    const apiUrl = ref('')

    watch(apiUrl, (val) => {
        if (val.trim()) {
            fetchDiscounts()
        }
    })

    const showSnackbars = ref(false)
    const snackbarsMessage = ref('')

    const discounts = ref<Diskon[]>([])
    const selectedIds = ref<string[]>([])

    // get list diskon
    const fetchDiscounts = async () => {
        if (!apiUrl.value) return

        try {
            const res = await fetch(apiUrl.value)
            discounts.value = await res.json()
        } catch (err) {
            console.error('Gagal fetch diskon', err)
        }
    }

    onMounted(fetchDiscounts)

    const deleteDialogOpen = ref(false)
    const deleteDiscountName = ref('')
    const deleteDiscountId = ref('')

    // Delete dialog
    const openDeleteDialog = (id: string, name: string) => {
        if (id && name) {
            deleteDiscountId.value = id
            deleteDiscountName.value = name
        }

        if (selectedIds.value.length) {
            deleteDiscountId.value = selectedIds.value[0] ?? ''
        }

        dialogOpen.value = false
        deleteDialogOpen.value = true
    }

    // Action delete
    const deleteDiscount = async () => {
        const idsToDelete = selectedIds.value.length
            ? selectedIds.value
            : deleteDiscountId.value
            ? [deleteDiscountId.value]
            : []

        if (!idsToDelete.length) return

        try {
            await Promise.all(
                idsToDelete.map(id =>
                    fetch(`${apiUrl.value}/${id}`, { method: 'DELETE' })
                )
            )
            
            // Snackbar message
            if (idsToDelete.length > 1) {
                snackbarsMessage.value = `Diskon berhasil dihapus.`
            } else {
                snackbarsMessage.value = `[${deleteDiscountName.value}] berhasil dihapus.`
            }

            showSnackbars.value = true
            setTimeout(() => (showSnackbars.value = false), 5000)

            // Refresh
            await fetchDiscounts()
        } catch (err) {
            console.error('Gagal menghapus diskon', err)
        } finally {
            editDiscount.value = null
            deleteDialogOpen.value = false
            deleteDiscountId.value = ''
            deleteDiscountName.value = ''
            selectedIds.value = []
        }
    }

    // Search
    const search = ref('')
    const sortedDiscounts = computed(() =>
        [...discounts.value].sort((a, b) =>
            a.name.localeCompare(b.name, 'id-ID', { sensitivity: 'base' })
        )
    )

    const existingNames = computed(() =>
        sortedDiscounts.value
            .filter((d: Diskon) => d._id !== editDiscount.value?._id)
            .map((d: Diskon) => d.name.toLowerCase().trim())
    )

    const filteredDiscounts = computed(() => {
        const keyword = search.value.toLowerCase()
        return discounts.value.filter((d: Diskon) =>
            d.name.toLowerCase().includes(keyword)
        )
    })

    const hasSelection = computed(() => selectedIds.value.length > 0)
    const toggleRow = (id: string, name: string) => {
        if (selectedIds.value.includes(id)) {
            selectedIds.value = selectedIds.value.filter(x => x !== id)
        } else {
            selectedIds.value.push(id)
        }

        deleteDiscountName.value = name
    }

    const toggleAll = (checked: boolean) => {
        selectedIds.value = checked
            ? filteredDiscounts.value.map((d) => d._id)
                : []
    }

    const handleSaved = (name: string, isEdit: boolean) => {
        if (isEdit) {
            snackbarsMessage.value = `[${name}] berhasil disimpan.`
        } else {
            snackbarsMessage.value = `[${name}] berhasil ditambahkan.`
        }

        showSnackbars.value = true

        fetchDiscounts();

        setTimeout(() => {
            showSnackbars.value = false
        }, 5000)
    }
</script>
<template>
    <DiscountDialog 
        :open="dialogOpen" 
        :edit-discount="editDiscount" 
        :api-url="apiUrl" 
        :existing-names="existingNames"
        @delete="openDeleteDialog" 
        @close="dialogOpen=false" 
        @saved="handleSaved" 
    />
    <DiscountDeleteDialog 
        :open="deleteDialogOpen" 
        :selected-ids="selectedIds" 
        :api-url="apiUrl" 
        :selected-discount-name="deleteDiscountName" 
        @cancel="deleteDialogOpen=false"
        @delete="deleteDiscount" 
    />
    <div v-if="showSnackbars" class="snackbars">
        {{ snackbarsMessage }}
    </div>
    <div class="container">
        <div class="card">
            <div class="header">
                <div>
                    <h1 class="title">Daftar Diskon</h1>
                    <p class="subtitle">Total jumlah diskon: {{ discounts.length }}</p>
                </div>
                <div class="header-actions" v-if="hasSelection">
                    <md-filled-button class="cancel-danger-btn" @click="selectedIds = []">
                        Batalkan
                    </md-filled-button>
                    <md-filled-button class="danger-btn" @click="openDeleteDialog">
                        Hapus
                    </md-filled-button>
                </div>
                <md-filled-button class="add-btn" @click="openDialog" v-if="!hasSelection">
                    <img src="/plus-icon.svg" class="plus-icon" />
                    Tambah diskon
                </md-filled-button>
            </div>
            <div class="toolbar">
                <div class="search-box" v-if="sortedDiscounts.length > 0">
                    <img src="/search-icon.svg" class="search-icon" />
                    <input
                        placeholder="Cari diskon"
                        v-model="search"
                    />
                </div>
                <OutletDropdown v-model:apiUrl="apiUrl" />
            </div>
            <DiscountEmptyState
                v-if="sortedDiscounts.length === 0"
                @add="dialogOpen = true" />
            <DiscountTable
                v-else
                :discounts="sortedDiscounts"
                :search-discounts="filteredDiscounts" 
                :selected-ids="selectedIds" 
                @open-dialog="openDialog" 
                @toggle="toggleRow" 
                @toggle-all="toggleAll"
            />
        </div>
        <Footer />
    </div>
</template>
<style scoped>
    .header-actions {
        display: flex;
        gap: 12px;
    }
    .snackbars {
        position: fixed;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        background: #00695c;
        color: white;
        width: 360px;
        padding: 16px 15px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
    }
    .plus-icon {
        margin-right: 10px;
    }
    .container {
        margin: 24px auto;
        max-width: 1128px;
    }
    .card {
        background: #fff;
        border-radius: 24px;
        padding: 24px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }
    .title {
        font-size: 22px;
        font-weight: 600;
    }
    .subtitle {
        font-size: 13px;
        color: #6b7280;
        margin-top: 4px;
    }
    .toolbar {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
    }
    .search-box {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid #cdd2d5;
    }
    .search-box input {
        border: none;
        outline: none;
        font-size: 13px;
    }
    .search-icon {
        width: 16px;
        margin-left: 5px;
        margin-right: 5px;
    }
</style>
