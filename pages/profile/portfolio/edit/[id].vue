<template>
  <UIDevNavMenu></UIDevNavMenu>
  <div class="wrapper">
    <div class="head">
      <h3>Редактирование своего проекта</h3>
      <IconsCross
        class="cursor"
        @click="navigateTo('/profile/my')"
      ></IconsCross>
    </div>
    <div class="portfolio">
      <div class="left_part">
        <UIDevInput
          v-model="portfolio.title"
          label="Название проекта"
          type="text"
          placeholder="Введите краткое, но понятное название"
          maxlength="40"
          :rules="rules.notEmpty"
          required
        ></UIDevInput>
        <UIDevInput
          v-model="portfolio.role"
          label="Ваша роль"
          type="text"
          placeholder="Например, Front-end разработчик или Web-designer"
          maxlength="40"
          :rules="rules.notEmpty"
          required
        ></UIDevInput>
        <UIDevTextarea
          v-model="portfolio.description"
          label="Описание проекта"
          placeholder="Например, Front-end разработчик или Web-designer"
          maxlength="1000"
          :rules="rules.notEmpty"
          required
        ></UIDevTextarea>
        <div class="block">
          <p>Навыки</p>
          <ProfileSkills
            :skills="portfolio.skills"
            @save="saveSkills"
            @delete="deleteSkill"
          ></ProfileSkills>
        </div>
      </div>
      <div class="right_part">
        <div v-if="video" class="file">
          <video
            :src="makeURL(video)"
            v-if="video.includes('/uploads/files/')"
            controls
            style="max-width: 100%; height: auto"
          ></video>
          <video
            :src="video"
            v-else
            controls
            style="max-width: 100%; height: auto"
          ></video>
          <!-- <div class="hover">
                        <div class="buttons">
                            <div class="button" @click="deleteFile(index)">
                                <IconsTrash style="transform: scale(1.3);"></IconsTrash>
                            </div>
                            <div class="button">
                                <input style="cursor: pointer;" type="file" accept="image/*"
                                    @change="handleFileReplace($event.target.files[0], index)">
                                <IconsEditPen style="transform: scale(1.3);"></IconsEditPen>
                            </div>
                        </div>
                        <div class="gradient"></div>
                    </div> -->
        </div>
        <div v-for="(file, index) in photos" :key="file" class="file">
          <img
            :src="makeURL(file)"
            alt="photo"
            v-if="file.includes('/uploads/files/')"
          />
          <img :src="file" alt="photo" v-else />
          <div class="hover">
            <div class="buttons">
              <div class="button" @click="deleteFile(index)">
                <IconsTrash style="transform: scale(1.3)"></IconsTrash>
              </div>
              <div class="button">
                <input
                  style="cursor: pointer"
                  type="file"
                  accept="image/*"
                  @change="handleFileReplace($event.target.files[0], index)"
                />
                <IconsEditPen style="transform: scale(1.3)"></IconsEditPen>
              </div>
            </div>
            <div class="gradient"></div>
          </div>
        </div>
        <div class="file_input">
          <div class="content">
            <div class="icons">
              <IconsGallery class="icon"></IconsGallery>
              <IconsVideo class="icon"></IconsVideo>
              <IconsFolder class="icon"></IconsFolder>
              <IconsPaperclip class="icon"></IconsPaperclip>
            </div>
            <p>
              Добавьте фото или видео к проекту<span style="color: $text-red"
                >*</span
              ><br />
              Первое фото будет обложкой для проекта
            </p>
          </div>
          <input
            style="cursor: pointer"
            type="file"
            accept="image/*,video/*"
            @change="handleFile($event.target.files[0])"
          />
        </div>
      </div>
    </div>
    <div class="footer">
      <UIDevButton type="active" :disabled="!isValid" @click="uploadFiles"
        >Опубликовать</UIDevButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">

import { makeURL } from "~/shared/utils/helpers";
import { rules } from "~/shared/utils/rules";
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
    portfolio.value?.title?.length &&
    portfolio.value?.description?.length &&
    portfolio.value?.role?.length &&
    photos.value?.length
  );
});

async function handleFile(file: File) {
  if (files.value.length >= 5) return;

  if (file && file.type.startsWith("image/")) {
    files.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  } else if (
    file &&
    file.type.startsWith("video/") &&
    file.size < 50 * 1024 * 1024
  ) {
    fileVideo.value = file;
    video.value = URL.createObjectURL(file);
  }
}

async function handleFileReplace(file: File, index: number) {
  files.value.splice(index, 1, file);

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.value.splice(index, 1, e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

function deleteFile(index: number) {
  files.value.splice(index, 1);
  photos.value.splice(index, 1);
}

async function uploadFiles() {
  if (photos.value.length === 0) return;

  const formData = new FormData();
  if (fileVideo.value) {
    formData.append("video", fileVideo.value);
  }

  for (let file in files.value) {
    formData.append("images", files.value[file]);
  }

  for (let photo in photos.value) {
    if (photos.value[photo].includes("/uploads/files/")) {
      formData.append("photos[]", photos.value[photo]);
    }
  }

  formData.append("title", portfolio.value.title);
  formData.append("description", portfolio.value.description);
  formData.append("role", portfolio.value.role);

  for (let skill in portfolio.value.skills) {
    formData.append("skills", portfolio.value.skills[skill]);
  }

  if (editMode.value) {
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
  const id = route.params.id as string;

  if (id) {
    editMode.value = true;
    const res = await portfolioStore.getPortfolio(id);

    portfolio.value.title = res.title;
    portfolio.value.description = res.description;
    portfolio.value.role = res.role;
    portfolio.value.skills = res.skills;

    photos.value = res.images;
    video.value = res.video;
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-height: 100dvh;
  background: $input-auth;
  position: absolute;
  top: 0;
  left: 0;
  padding: 50px 150px 300px 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;

  .head {
    font-size: 24px;
    font-weight: 500;
    color: $text-main;
    width: 100%;
    max-width: 1440px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 64px;

    .cursor {
      cursor: pointer;
    }
  }

  .portfolio {
    width: 100%;
    display: flex;
    gap: 32px;
    max-width: 1440px;
    margin-top: 32px;
  }

  .left_part {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 40%;

    .block {
      display: flex;
      flex-direction: column;
      gap: 12px;

      & > p {
        color: $white;
      }
    }
  }

  .right_part {
    width: calc(60% - 32px);
    display: flex;
    flex-direction: column;
    gap: 32px;

    .file_input {
      border: 2px dashed $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      padding: 60px;
      position: relative;

      .content {
        display: flex;
        flex-direction: column;
        gap: 32px;
        justify-content: center;
        align-items: center;

        .icons {
          display: flex;
          gap: 32px;
          align-items: center;

          .icon {
            width: 42px;
            height: 42px;
            border: 1px solid $text-placeholder;
            border-radius: 6px;
            padding: 8px;
          }
        }

        p {
          font-size: 14px;
          color: $text-placeholder;
          text-align: center;
        }
      }

      input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }

    .file {
      width: 100%;
      max-height: 500px;
      border: 2px solid $primary;
      border-radius: 6px;
      position: relative;

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }

      .hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s ease-in;

        .buttons {
          display: flex;
          gap: 8px;
          position: absolute;
          right: 14px;
          top: 10px;

          .button {
            background: $white;
            border-radius: 6px;
            border: 2px solid rgba(70, 144, 212, 0.376);
            width: 40px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            input {
              z-index: 10;
              position: absolute;
              width: 100%;
              height: 100%;
              opacity: 0;
            }
          }
        }

        .gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(107, 99, 99, 0.08) 2.74%,
            $black 100%
          );
        }
      }

      &:hover .hover {
        opacity: 1;
      }
    }
  }

  .footer {
    width: 100%;
    max-width: 1440px;
    display: flex;
    justify-content: end;
    margin-top: 100px;
  }
}
</style>
