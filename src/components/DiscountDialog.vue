<script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    const isEdit = computed(() => !!props.editDiscount?._id)

    interface Diskon {
        _id?: string
        name: string
        type: 'percent' | 'rupiah'
        value: number
        createdAt?: string
    }

    const props = defineProps<{
        open: boolean
        apiUrl: string
        editDiscount: Diskon | null,
        existingNames: string[]
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'saved', name: string, isEdit: boolean): void
        (e: 'delete', id: string, name: string): void
    }>()

    const name = ref('')
    const value = ref<number | null>(null)

    const discountType = ref<'percent' | 'rupiah'>('percent')

    const errors = ref({
        name: '',
        value: ''
    })

    // Validasi inputan
    const validate = () => {
        errors.value = { name: '', value: '' }

        const trimmedName = name.value.trim()

        if (!trimmedName) {
            errors.value.name = 'Nama diskon tidak boleh kosong.'
        } else {
            const isDuplicate = props.existingNames.includes(trimmedName.toLowerCase())
            const isSameAsOld =
                props.editDiscount &&
                trimmedName === props.editDiscount.name

            if (isDuplicate && !isSameAsOld) {
                errors.value.name = 'Nama diskon sudah digunakan, silahkan gunakan nama lain.'
            }
        }

        // Cek value diskon
        if (value.value === null || value.value === 0) {
            errors.value.value =
                value.value === null
                    ? 'Diskon tidak boleh kosong.'
                    : 'Diskon tidak boleh "0".'
        }
        
        return !errors.value.name && !errors.value.value
    }

    // Simpan data
    const save = async () => {
        if (!validate()) return

        const payload = {
            name: name.value,
            type: discountType.value,
            value: Number(displayValue.value),
            createdAt: new Date().toISOString()
        }

        const url = isEdit.value
            ? `${props.apiUrl}/${props.editDiscount!._id}`
            : props.apiUrl

        const method = isEdit.value ? 'PUT' : 'POST'

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        emit('saved', name.value, isEdit.value)
        emit('close')
        reset()
    }
    // Reset value
    const reset = () => {
        name.value = ''
        value.value = null
        discountType.value = 'percent'
        errors.value = { name: '', value: '' }
    }
    // Format
    const displayValue = computed({
        get() {
            if (value.value == null) return ''
            if (discountType.value === 'rupiah') {
                return value.value.toLocaleString('id-ID')
            }
            return value.value
        },
        set(val: string) {
            const numeric = Number(val.replace(/\./g, ''))
            value.value = isNaN(numeric) ? null : numeric
        }
    })

    watch(
        () => props.editDiscount,
        (val) => {
            if (val) {
                name.value = val.name ?? ''
                value.value = typeof val.value === 'number' ? val.value : null
                discountType.value = val.type === 'rupiah' ? 'rupiah' : 'percent'
            } else {
                name.value = ''
                value.value = null
                discountType.value = 'percent'
            }
        },
        { immediate: true }
    )

</script>
<template>
    <md-dialog :open="open" @closed="$emit('close')">
        <div slot="headline" class="dialog-header">
            <h3 class="title">{{isEdit ? "Ubah Diskon" : "Tambah Diskon"}}</h3>
            <md-icon-button @click="$emit('close')">
                <img src="/close-icon.svg" class="close-icon"/>
            </md-icon-button>
        </div>
        <div slot="content" class="dialog-content">
            <md-outlined-text-field
                label="Nama Diskon"
                :error="!!errors.name"
                :error-text="errors.name"
                v-model="name"
                placeholder="Misal: Diskon opening, diskon akhir tahun"
                style="width:100%"
            />
            <div class="discount-row">
                <md-outlined-text-field
                    label="Diskon"
                    :error="!!errors.value"
                    :error-text="errors.value"
                    v-model="displayValue"
                    :suffix-text="discountType === 'percent' ? '%' : ''"
                    :prefix-text="discountType === 'rupiah' ? 'Rp' : ''"
                    placeholder="0"
                    style="flex:1"
                />
                <div class="unit-toggle">
                    <button
                        :class="{ active: discountType === 'percent' }"
                        @click="discountType = 'percent' ">
                        <img src="/icon-check-mark.svg" class="check-icon" v-if="discountType === 'percent'" />
                        <img src="/icon-percent-active.svg" class="percent-icon" v-if="discountType === 'percent'" />
                        <img src="/icon-percent.svg" class="percent-icon" v-if="discountType !== 'percent'" />
                    </button>
                    <button
                        :class="{ active: discountType === 'rupiah' }"
                        @click="discountType = 'rupiah'">
                        <img src="/icon-check-mark.svg" class="check-icon" v-if="discountType === 'rupiah'" />
                        <img src="/icon-rp-active.svg" class="rp-icon" v-if="discountType === 'rupiah'" />
                        <img src="/icon-rp.svg" class="rp-icon" v-if="discountType !== 'rupiah'" />
                    </button>
                </div>
            </div>
        </div>
        <div slot="actions" class="dialog-actions">
            <md-text-button
                class="delete-btn"
                v-if="isEdit && props.editDiscount"
                @click="emit('delete', props.editDiscount._id!, props.editDiscount.name)"
            >
                Hapus
            </md-text-button>
            <md-filled-button :class="{ saveEditBtn: isEdit }" class="save-btn" @click="save">Simpan</md-filled-button>
        </div>
    </md-dialog>
</template>
<style scoped>
    md-outlined-text-field[error] {
        --md-outlined-text-field-outline-color: #FF3553;
        --md-outlined-text-field-border-width: 2px;
        --md-outlined-text-field-label-text-color: #FF3553;
        --md-outlined-text-field-supporting-text-color: #FF3553;
    }
    md-outlined-text-field {
        --md-outlined-text-field-input-text-suffix-color: #869098;
        --md-outlined-text-field-input-text-prefix-color: #869098;
        --md-outlined-text-field-input-text-prefix-trailing-space: 10px;
    }
    .delete-btn {
        color:#FF3553;
        width: 100%;
        font-weight: 600;
        cursor: pointer;
    }
    .saveEditBtn {
        width: 30% !important;
    }
    .dialog-content {
        gap: 16px;
        padding-top: 16px;
    }
    .close-icon {
        width: 14px;
    }
    .percent-icon {
        width: 13px;
    }
    .check-icon {
        margin-right: 16px;
        width: 13px;
    }
    .rp-icon {
        width: 13px;
    }
    .discount-row {
        display: flex;
        gap: 12px;
        align-items: center;
    }
    .unit-toggle {
        display: flex;
        border-radius: 10px;
        border: 1px solid #CDD2D5;
        overflow: hidden;
    }
    .unit-toggle button {
        padding: 15px 16px;
        border: none;
        background: #fff;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 75px;
    }
    .unit-toggle button.active {
        background: #E8F5E9;
        color: #3DAE2F;
    }
    .save-btn {
        width: 100%;
        --md-filled-button-container-color: #3DAE2F;
        --md-filled-button-container-shape: 999px;
    }
</style>