<template>
    <div class="empty-state">
        <img
          src="/il_empty_state_discount_not_available.svg"
          class="illustration"
        />
        <h2 class="title">Belum Ada Diskon</h2>
        <p>
          Silahkan tambah diskon untuk menarik pelanggan dan
          meningkatkan penjualan.
        </p>
        <md-filled-button class="add-btn" @click="$emit('add')">
          <img src="/plus-icon.svg" class="icon" />
          Tambah diskon
        </md-filled-button>
      </div>
</template>
<style scoped>
    .illustration {
        width: 260px;
    }
    .empty-state {
        height: 516px;
        border: 1px solid #ecedef;
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 12px;
    }
    .empty-state p {
        max-width: 360px;
        line-height: 1.6;
        margin-top: 0px;
    }
</style>