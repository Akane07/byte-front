<template>
  <div
    class="wrapper w-full min-h-dvh absolute top-0 left-0 flex flex-col justify-center items-center mb-25 py-[150px] pt-[50px] pb-[300px]">
    <div class="head w-full max-w-[1440px] flex items-center justify-between mt-16">
      <h3 class="font-medium text-2xl">
        {{
          editMode
            ? "Редактирование своего проекта"
            : "Добавьте новый проект в портфолио"
        }}
      </h3>
      <IconsCross class="cursor-pointer" @click="navigateTo('/profile/my')" />
    </div>

    <div class="w-full flex gap-8 max-w-[1440px] mt-8">
      <div class="flex flex-col gap-8 w-[40%]">
        <UIDevInput v-model="portfolio.title" label="Название проекта" type="text"
          placeholder="Введите краткое, но понятное название" maxlength="40" :rules="rules.notEmpty" required />
        <UIDevInput v-model="portfolio.role" label="Ваша роль" type="text"
          placeholder="Например, Front-end разработчик или Web-designer" maxlength="40" :rules="rules.notEmpty"
          required />
        <UIDevTextarea v-model="portfolio.description" label="Описание проекта"
          placeholder="Например, Front-end разработчик или Web-designer" maxlength="1000" :rules="rules.notEmpty"
          required />
        <div class="flex flex-col gap-3">
          <p class="text-white">Навыки</p>
          <ProfileSkills :skills="portfolio.skills" @save="saveSkills" @delete="deleteSkill" />
        </div>
      </div>

      <div class="flex flex-col gap-8 w-[calc(60%-32px)]">
        <div v-if="video" class="file">
          <!-- если это уже сохранённое видео с бэка -->
          <video v-if="
            typeof video === 'string' && video.includes('/uploads/files/')
          " :src="makeURL(video as string)" controls style="max-width: 100%; height: auto" />
          <!-- если только что выбранное видео (blob url) -->
          <video v-else :src="video as string" controls style="max-width: 100%; height: auto" />
        </div>

        <div v-for="(file, index) in photos" :key="file + index" class="file w-full max-h-[500px] rounded-md relative">
          <img class="w-full h-full rounded-md object-cover"
            v-if="typeof file === 'string' && file.includes('/uploads/files/')" :src="makeURL(file)" alt="photo" />
          <img v-else :src="file" alt="photo" class="w-full h-full rounded-md object-cover" />
          <div class="hover absolute top-0 left-0 w-full h-full opacity-0">
            <div class="flex gap-2 absolute right-3.5 top-2.5">
              <div class="button w-9 h-9 flex items-center justify-center rounded-md relative cursor-pointer"
                @click="deleteFile(index)">
                <IconsTrash style="transform: scale(1.3)" color="white"></IconsTrash>
              </div>
              <div class="button w-9 h-9 flex items-center justify-center rounded-md relative">
                <input class="absolute z-10 w-full h-full opacity-0 cursor-pointer" type="file" accept="image/*"
                  @change="handleFileReplace($event.target.files[0], index)" />
                <IconsEditPen style="transform: scale(1.3)" color="white"></IconsEditPen>
              </div>
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
              Добавьте фото или видео к проекту<span style="color: $text-red">*</span><br />
              Первое фото будет обложкой для проекта
            </p>
          </div>
          <input class="cursor-pointer w-full h-full opacity-0 absolute" type="file" accept="image/*,video/*"
            @change="handleFile($event.target.files[0])" />
        </div>
      </div>
    </div>

    <div class="w-full flex justify-end mt-25 max-w-[1440px]">
      <UIDevButton type="active" :disabled="!isValid" @click="uploadFiles">
        Опубликовать
      </UIDevButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rules } from "~/shared/utils/rules";
import { makeURL } from "~/shared/utils/helpers";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const editMode = shallowRef(false);

const portfolio = ref({
  title: "",
  description: "",
  role: "",
  skills: [] as string[],
});

const files = ref<File[]>([]);
const photos = ref<string[]>([]);
const video = ref<string | null>(null);
const fileVideo = ref<File | null>(null);

const isValid = computed(() => {
  return (
    portfolio.value.title?.length &&
    portfolio.value.description?.length &&
    portfolio.value.role?.length &&
    photos.value.length
  );
});

async function handleFile(file: File) {
  if (!file) return;
  if (files.value.length >= 5) return;

  if (file.type.startsWith("image/")) {
    files.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.value.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  } else if (file.type.startsWith("video/") && file.size < 50 * 1024 * 1024) {
    fileVideo.value = file;
    video.value = URL.createObjectURL(file);
  }
}

async function handleFileReplace(file: File, index: number) {
  if (!file) return;

  files.value.splice(index, 1, file);

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.value.splice(index, 1, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
}

function deleteFile(index: number) {
  files.value.splice(index, 1);
  photos.value.splice(index, 1);
}

async function uploadFiles() {
  if (!photos.value.length) return;

  const formData = new FormData();

  if (fileVideo.value) {
    formData.append("video", fileVideo.value);
  }

  for (const file of files.value) {
    formData.append("images", file);
  }

  for (const photo of photos.value) {
    if (photo.includes("/uploads/files/")) {
      formData.append("photos[]", photo);
    }
  }

  formData.append("title", portfolio.value.title);
  formData.append("description", portfolio.value.description);
  formData.append("role", portfolio.value.role);

  for (const skill of portfolio.value.skills) {
    formData.append("skills", skill);
  }

  if (editMode.value && route.params.id) {
    await portfolioStore.editPortfolio(formData, route.params.id as string);
  } else {
    await portfolioStore.createPortfolio(formData);
  }

  router.back();
}

function deleteSkill(index: number) {
  portfolio.value.skills.splice(index, 1);
}

function saveSkills(skills: string[]) {
  portfolio.value.skills = skills;
}

onMounted(async () => {
  await userStore.checkAuth();
  const id = route.params.id as string | undefined;

  if (id) {
    editMode.value = true;
    const res = await portfolioStore.getPortfolio(id);

    portfolio.value.title = res.title;
    portfolio.value.description = res.description;
    portfolio.value.role = res.role;
    portfolio.value.skills = res.skills;

    photos.value = res.images || [];
    video.value = res.video || null;
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

      .button {
        background: $tag-secondary-color;
      }
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
</style>
