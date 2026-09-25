<template>
  <div
    class="wrapper w-full min-h-dvh absolute top-0 left-0 flex flex-col justify-center items-center mb-25 py-[150px] pt-[50px] pb-[300px]"
  >
    <div class="head w-full max-w-[1440px] flex items-center justify-between mt-16">
      <h3 class="font-medium text-2xl">
        {{ editMode ? "Редактирование своего проекта" : "Добавьте новый проект в портфолио" }}
      </h3>
      <IconsCross class="cursor-pointer" @click="router.back()" />
    </div>

    <div class="w-full flex gap-8 max-w-[1440px] mt-8">
      <div class="flex flex-col gap-8 w-[40%]">
        <UIInput
          v-model="portfolio.title"
          label="Название проекта"
          type="text"
          placeholder="Введите краткое, но понятное название"
          maxlength="100"
          :rules="rules.notEmpty"
          required
        />
        <UIInput
          v-model="portfolio.role"
          label="Ваша роль"
          type="text"
          placeholder="Например, Front-end разработчик или Web-designer"
          maxlength="100"
          :rules="rules.notEmpty"
          required
        />
        <UITextarea
          v-model="portfolio.description"
          label="Описание проекта"
          placeholder="Расскажите, что это за проект и что вы в нём сделали"
          maxlength="2000"
          :rules="rules.notEmpty"
          required
        />
        <div class="flex flex-col gap-3">
          <p class="text-white">Навыки</p>
          <ProfileSkills
            :skills="portfolio.skills"
            @save="portfolio.skills = $event"
            @delete="portfolio.skills.splice($event, 1)"
          />
        </div>
      </div>

      <div class="flex flex-col gap-8 w-[calc(60%-32px)]">
        <div v-if="video" class="file relative">
          <video :src="video.preview" controls style="max-width: 100%; height: auto" />
          <div class="absolute right-3.5 top-2.5">
            <LazyUIActionButton @click="video = null">
              <template #icon="{ color }">
                <IconsTrash style="transform: scale(1.3)" :color="color" />
              </template>
            </LazyUIActionButton>
          </div>
        </div>

        <div
          v-for="(image, index) in images"
          :key="image.preview"
          class="file w-full max-h-[500px] rounded-md relative"
        >
          <img :src="image.preview" alt="photo" class="w-full h-full rounded-md object-cover" />
          <div class="hover absolute top-0 left-0 w-full h-full opacity-0">
            <div class="flex gap-2 absolute right-3.5 top-2.5">
              <LazyUIActionButton @click="images.splice(index, 1)">
                <template #icon="{ color }">
                  <IconsTrash style="transform: scale(1.3)" :color="color" />
                </template>
              </LazyUIActionButton>
              <LazyUIActionButton>
                <template #icon="{ color }">
                  <input
                    class="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    @change="replaceImage($event, index)"
                  />
                  <IconsEditPen style="transform: scale(1.3)" :color="color" />
                </template>
              </LazyUIActionButton>
            </div>
            <div class="gradient" />
          </div>
        </div>

        <div class="file_input flex items-center justify-center rounded-md p-15 relative">
          <div class="flex flex-col gap-8 justify-center items-center">
            <div class="flex items-center gap-8">
              <IconsGallery class="icon" />
              <IconsVideo class="icon" />
              <IconsFolder class="icon" />
              <IconsPaperclip class="icon" />
            </div>
            <p class="text-sm text-center">
              Добавьте фото или видео к проекту<span class="required">*</span><br />
              До {{ MAX_IMAGES }} фото, первое будет обложкой проекта
            </p>
          </div>
          <input
            class="cursor-pointer w-full h-full opacity-0 absolute"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            @change="addFile"
          />
        </div>
      </div>
    </div>

    <div class="w-full flex justify-end mt-25 max-w-[1440px]">
      <UIButton type="active" :disabled="!isValid || saving" @click="submit">
        {{ editMode ? "Сохранить" : "Опубликовать" }}
      </UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeURL } from "~/shared/utils/helpers";
import { rules } from "~/shared/utils/rules";
import { useNotifications } from "~/store/notiStore";
import { usePortfolioStore } from "~/store/portfolioStore";

const MAX_IMAGES = 5;
const MAX_VIDEO_MB = 50;

/**
 * Картинка или видео проекта: уже загруженная на сервер (url)
 * или только что выбранная (file). preview — что показать в <img>/<video>.
 * Раньше файлы и превью лежали в двух массивах с разными индексами,
 * и удаление картинки в режиме редактирования убирало не тот файл.
 */
type Media = { preview: string; url?: string; file?: File };

const route = useRoute();
const router = useRouter();
const portfolioStore = usePortfolioStore();
const notifications = useNotifications();

const editId = computed(() => route.params.id as string | undefined);
const editMode = computed(() => !!editId.value);
const saving = shallowRef(false);

const portfolio = ref({
  title: "",
  description: "",
  role: "",
  skills: [] as string[],
});
const images = ref<Media[]>([]);
const video = ref<Media | null>(null);
/** Было ли видео у проекта до редактирования — чтобы отправить его удаление. */
const hadVideo = shallowRef(false);

const isValid = computed(
  () =>
    !!portfolio.value.title.trim() &&
    !!portfolio.value.description.trim() &&
    !!portfolio.value.role.trim() &&
    images.value.length > 0,
);

function pickFile(event: Event): File | null {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  input.value = ""; // чтобы тот же файл можно было выбрать повторно
  return file;
}

function toMedia(file: File): Media {
  return { preview: URL.createObjectURL(file), file };
}

function addFile(event: Event) {
  const file = pickFile(event);
  if (!file) return;

  if (file.type.startsWith("video/")) {
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      notifications.setNotification(`Видео должно быть не больше ${MAX_VIDEO_MB} МБ`);
      return;
    }
    video.value = toMedia(file);
  } else if (images.value.length >= MAX_IMAGES) {
    notifications.setNotification(`Можно добавить не больше ${MAX_IMAGES} изображений`);
  } else {
    images.value.push(toMedia(file));
  }
}

function replaceImage(event: Event, index: number) {
  const file = pickFile(event);
  if (file) images.value.splice(index, 1, toMedia(file));
}

function buildForm() {
  const form = new FormData();
  form.append("title", portfolio.value.title.trim());
  form.append("description", portfolio.value.description.trim());
  form.append("role", portfolio.value.role.trim());
  portfolio.value.skills.forEach((skill) => form.append("skills", skill));

  for (const image of images.value) {
    if (image.file) form.append("images", image.file);
    else if (image.url) form.append("photos[]", image.url);
  }

  if (video.value?.file) {
    form.append("video", video.value.file);
  } else if (video.value?.url) {
    form.append("video", video.value.url);
  } else if (hadVideo.value) {
    form.append("video", ""); // видео удалили при редактировании
  }
  return form;
}

async function submit() {
  saving.value = true;
  const res = editId.value
    ? await portfolioStore.editPortfolio(buildForm(), editId.value)
    : await portfolioStore.createPortfolio(buildForm());
  saving.value = false;

  if (res) {
    notifications.setNotification(editMode.value ? "Проект сохранён" : "Проект добавлен в портфолио");
    router.back();
  }
}

onMounted(async () => {
  if (!editId.value) return;

  const res = await portfolioStore.getPortfolio(editId.value);
  if (!res) {
    router.back();
    return;
  }

  portfolio.value = {
    title: res.title,
    description: res.description,
    role: res.role,
    skills: [...res.skills],
  };
  images.value = res.images.map((url) => ({ url, preview: makeURL(url) }));
  if (res.video) {
    video.value = { url: res.video, preview: makeURL(res.video) };
    hadVideo.value = true;
  }
});

// Освобождаем blob-ссылки на выбранные файлы.
onBeforeUnmount(() => {
  for (const media of [...images.value, video.value]) {
    if (media?.file) URL.revokeObjectURL(media.preview);
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  background: $input-auth;

  .head {
    color: $text-main;
  }

  .file_input {
    border: 2px dashed $primary;

    .icon {
      width: 42px;
      height: 42px;
      border: 1px solid $text-placeholder;
      border-radius: 6px;
      padding: 8px;
    }

    p {
      color: $text-placeholder;
    }
  }

  .file {
    border: 2px solid $primary;

    .hover {
      transition: opacity 0.2s ease-in;
    }

    .gradient {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg,
          rgba(107, 99, 99, 0.08) 2.74%,
          $black 100%);
    }

    &:hover .hover {
      opacity: 1;
    }
  }
}


.required {
  color: $text-red;
}
</style>
