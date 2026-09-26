<template>
  <button type="button" class="google" @click="unavailable">
    <span class="icon">
      <img src="~/assets/icons/Google.svg" alt="" />
    </span>
    <span class="text">
      <span class="small">Войти с помощью</span>
      <span class="name">Google</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { useNotifications } from "~/store/notiStore";

const notifications = useNotifications();

function unavailable() {
  notifications.setNotification("Вход через Google пока недоступен");
}
</script>

<style scoped lang="scss">
.google {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 51px;
  padding: 0 32px;
  border: none;
  border-radius: 6px;
  background: $input-auth;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: #1f1f24;

    img {
      transform: scale(1.1);
    }
  }
}

.icon {
  display: flex;
  align-items: center;
  padding-right: 10px;
  border-right: 1px solid #3d3d49;

  img {
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
  }
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.small {
  font-size: 10px;
  color: $text-secondary;
}

.name {
  font-size: 14px;
  color: $white;
}
</style>
