<script setup lang="ts">
    import { ref, watch } from 'vue'

    const props = defineProps<{
        apiUrl: string
    }>()

    const emit = defineEmits<{
        (e: 'update:apiUrl', value: string): void
    }>()

    const open = ref(false)
    const draftApiUrl = ref(props.apiUrl)

    watch(
        () => props.apiUrl,
        (val) => {
            draftApiUrl.value = val
        }
    )

    const apply = () => {
        emit('update:apiUrl', draftApiUrl.value)
        open.value = false
    }
</script>
<template>
    <div class="outlet-dropdown">
        <button class="outlet-btn" @click="open = !open">
            <img src="/outlet-icon.svg" class="outlet-icon" />
            <span class="outlet-text">Kopi Anak Bangsa</span>
            <img
                src="/arrow-down.svg"
                class="arrow-icon"
                :class="{ rotate: open }"
            />
        </button>
        <!-- API URL DROPDOWN PANEL -->
        <div v-if="open" class="dropdown-panel">
            <div class="api-setting">
                <md-outlined-text-field
                    class="api-input"
                    label="API URL crudcrud.com"
                    placeholder="https://crudcrud.com/api/.../diskon"
                    :value="draftApiUrl"
                    @input="(e: Event) => {
                        draftApiUrl = (e.target as HTMLInputElement).value
                    }"
                />
                <md-filled-button class="apply-btn" @click="apply">
                    Terapkan
                </md-filled-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .arrow-icon {
        width: 10px;
        transition: transform 0.2s ease;
    }
    .arrow-icon.rotate {
        transform: rotate(180deg);
    }
    .outlet-dropdown {
        position: relative;
    }
    .outlet-icon {
        width: 13px;
    }
    .outlet-text {
        font-size: 12px;
        font-weight: 500;
        color: #4b5258;
    }
    .outlet-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;

        border-radius: 12px;
        border: 1px solid #cdd2d5;
        background: #ffffff;
        cursor: pointer;
        }
    .dropdown-panel {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;

        width: 360px;
        padding: 16px;
        border-radius: 12px;

        background: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    .api-setting {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .api-input {
        width: 100%;
    }
    .apply-btn {
        align-self: flex-end;
        --md-filled-button-container-color: #3DAE2F;
        --md-filled-button-container-shape: 999px;
    }
</style>