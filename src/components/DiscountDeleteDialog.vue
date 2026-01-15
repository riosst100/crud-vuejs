<script setup lang="ts">
    const props = defineProps<{
        open: boolean
        apiUrl: string
        selectedDiscountName: string
        selectedIds: string[]
    }>()

    const emit = defineEmits(['cancel', 'delete'])
</script>
<template>
    <md-dialog :open="open" @closed="$emit('cancel')">
        <div slot="headline" class="dialog-header">
            <h3 class="title">Hapus Diskon</h3>
        </div>
        <div slot="content" class="dialog-content">
            <p v-if="props.selectedIds.length > 1">
                Apakah Anda yakin ingin menghapus diskon yang dipilih?
            </p>
            <p v-else>
                Apakah Anda yakin ingin menghapus diskon [{{props.selectedDiscountName}}]?
            </p>
            <ul>
                <li>Diskon yang dihapus tidak bisa dikembalikan lagi.</li>
            </ul>
        </div>
        <div slot="actions" class="dialog-actions">
            <md-filled-button class="cancel-danger-btn" @click="emit('cancel')">
                Batalkan
            </md-filled-button>
            <md-filled-button class="danger-btn" @click="emit('delete')">
                Hapus
            </md-filled-button>
        </div>
    </md-dialog>
</template>
<style scoped>
    .save-btn {
        width: 100%;
        --md-filled-button-container-color: #3DAE2F;
        --md-filled-button-container-shape: 999px;
    }
    p {
        margin-bottom: 5px;
    }
    ul {
        margin: 0;
        padding-left: 25px;
    }
</style>
