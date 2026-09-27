<template>
  <!-- /chat без открытого диалога: на десктопе справа от списка была пустота. -->
  <div class="dialog-placeholder">
    <div class="icon">
      <IconsChat />
    </div>
    <p>Выберите диалог</p>
    <span>Здесь появится переписка. Написать исполнителю или заказчику можно из его профиля.</span>
  </div>
</template>

<style scoped lang="scss">
.dialog-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  text-align: center;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-bottom: 8px;
    border-radius: 50%;
    background: rgba(131, 85, 250, 0.12);

    :deep(svg) {
      width: 32px;
      height: 32px;
    }
  }

  p {
    font-size: 18px;
    font-weight: 600;
    color: $text-main;
  }

  span {
    max-width: 320px;
    font-size: 14px;
    line-height: 1.5;
    color: $text-placeholder;
  }
}
</style>
