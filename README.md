# Freelance Byte — фронтенд

Интерфейс биржи удалённого фриланса и услуг на месте. Nuxt 3 SPA (`ssr: false`), Vue 3, Pinia, Tailwind CSS 4, SCSS, axios, socket.io-client. Точные зависимости — [package-lock.json](package-lock.json).

Сверено 31.10.2026 с кодом, включающим отмену заказов из `pool-5-cancel`. Ветка `pool-6-docs` основана на ней и зависит от её интеграции.

## Запуск

Нужны Node.js 22+ и работающий [бэкенд](../byte-back/README.md), обычно на `http://localhost:3001`. Из `byte-front`:

```powershell
npm ci
npm run dev
```

Открыть `http://localhost:3000`. Nuxt слушает IPv4 `127.0.0.1`; бэкенд по умолчанию разрешает CORS именно для `http://localhost:3000`.

Настройки по умолчанию — в [nuxt.config.ts](nuxt.config.ts). Для других адресов при первоначальной настройке создать `.env` из [.env.example](.env.example), если его ещё нет:

```powershell
Copy-Item .env.example .env
```

| Переменная | По умолчанию | Назначение |
|---|---|---|
| `NUXT_PUBLIC_API_ORIGIN` | `http://localhost:3001` | Origin REST, сокета и файлов; без `/api/v1` в конце |
| `NUXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Адрес сайта для копирования ссылок |

Обе переменные доступны в браузере и не предназначены для секретов. При смене origin фронта согласовать `CORS_ORIGIN` бэкенда. В Linux/macOS копирование — через `cp`.

## Путь данных

Страница/компонент → функции `shared/api/`, при необходимости через Pinia → axios → `/api/v1` → NestJS → MongoDB → JSON → реактивное состояние Vue.

- [shared/api/index.ts](shared/api/index.ts) — общий клиент, JWT, проверка HTML вместо JSON, helper `call`, возвращающий `null` при ошибке.
- [plugins/api.ts](plugins/api.ts) — адрес из runtimeConfig, 401 со сбросом сессии, 403 `EMAIL_NOT_VERIFIED` с окном подтверждения, уведомления об остальных ошибках.
- JWT хранится в `localStorage["byte-accessToken"]`, передаётся в `Authorization`. Cookie-сессий нет, профиль не рендерится сервером.
- [composables/useChatSocket.ts](composables/useChatSocket.ts) — одно соединение socket.io на вкладку, JWT при подключении/переподключении. События обновляют чат и сделки.
- Файлы приходят как `/uploads/...`; [helpers.ts](shared/utils/helpers.ts) добавляет origin API. Для туннеля origin может быть пустым: путь остаётся относительным.

Например, [Recommendations.vue](components/orders/Recommendations.vue) напрямую вызывает `getRecommendations` с `explain=1`, получает отсортированных кандидатов и показывает объяснения через [recommendation.ts](shared/utils/recommendation.ts). Score считает сервер. API вызывается и из компонентов, и из сторов; отдельный стор для каждого запроса не обязателен.

## Структура

| Путь | Ответственность |
|---|---|
| [pages](pages/) | Маршруты Nuxt |
| [components/UI](components/UI/) | Навигация, поля, модалки, карточки, фон |
| [components/orders](components/orders/) | Форма, карточки, фильтры, подбор |
| [components/chat](components/chat/) | Сообщения, вложения, карточки сделок и отмены |
| [components/reviews](components/reviews/) | Оценки и отзывы |
| [components/profile](components/profile/) | Профиль и портфолио |
| [store](store/) | Пользователь, заказы, чат, отзывы, уведомления |
| [shared/api](shared/api/) | Типы и функции HTTP API |
| [shared/types.ts](shared/types.ts) | В том числе типы сообщений |
| [shared/utils](shared/utils/) | Маршруты, форматирование, причины рекомендаций |
| [composables](composables/) | Сокет, цены, даты, таймеры и поведение |
| [middleware/auth.global.ts](middleware/auth.global.ts) | Гостевой доступ и возврат после входа |
| [assets/styles](assets/styles/) | Tailwind, SCSS, адаптив |
| [scripts/share.mjs](scripts/share.mjs) | Сборка, прокси и туннель |

## Экраны

| Маршрут | Сценарий |
|---|---|
| `/` | Лендинг |
| `/orders`, `/orders/:id` | Лента, заказ, подбор для автора |
| `/orders/create`, `/orders/:id/edit` | Общая форма заказа |
| `/orders/my` | Свои заказы, отклики, черновики, ожидающие отзывы |
| `/orders/suggest` | Выбор заказа для предложения |
| `/specialists` | Каталог исполнителей |
| `/chat`, `/chat/:id` | Диалоги и сделки |
| `/profile/:id`, `/profile/my`, `/profile/my/settings` | Профили и настройки |
| `/profile/portfolio/:id`, `/profile/new-project`, `/profile/portfolio/edit/:id` | Портфолио |
| `/mutual/:id` | Общие заказы |
| `/auth/login`, `/auth/registration`, `/auth/recovery` | Авторизация и восстановление |
| `/donates` | Декоративный макет с тестовыми реквизитами |

Гостю доступны лендинг, донаты, лента и опубликованный заказ, каталог, публичные профили и портфолио. Список — [routes.ts](shared/utils/routes.ts); сервер отдельно проверяет доступ к данным. Защищённые действия предлагают войти.

## Проверки и сборка

Типы на Windows, без пересоздания `.nuxt`:

```powershell
.\node_modules\.bin\vue-tsc.cmd --noEmit
```

Нужны подготовленные типы Nuxt: первый `npm ci` создаёт их через `postinstall: nuxt prepare`. На Linux/macOS — `./node_modules/.bin/vue-tsc --noEmit`.

При остановленном dev-сервере:

```powershell
npm run typecheck
npm run build
npm run preview
```

Обычные build/typecheck пересоздают общую `.nuxt` и могут нарушить работающий `npm run dev`. Для параллельной проверки — прямой `vue-tsc` и отдельная сборка:

```powershell
.\node_modules\.bin\nuxt.cmd build --envName share
```

Она пишет в `.nuxt-share` / `.output-share`. Перед запуском проверять порты 3000/3001, после проверки останавливать свои серверы по PID.

При ознакомлении 31.10.2026 проверка типов прошла. Отдельного линтера и автотестов фронтенда сейчас нет; backend e2e проверяют HTTP и socket.io, а не браузерный UI.

## Данные и показ на другом устройстве

В бэкенде есть `npm run seed`; тестовые аккаунты: `sergey@seed.test`, `alina@seed.test`, пароль `Seed1234`. Seed пересоздаёт набор; адрес базы и ограничения описаны в README бэкенда.

При работающих бэкенде и локальной MongoDB:

```powershell
npm run share
# Повторный запуск без пересборки:
npm run share -- --no-build
```

Скрипт отдельно собирает фронт, проксирует `/api/v1`, `/uploads`, `/socket.io` и открывает Cloudflare Tunnel. Swagger через него не опубликован. Ссылка действует до остановки. На Windows cloudflared при необходимости скачивается в `.share/`; `CLOUDFLARED` задаёт готовый бинарник, `SHARE_API` — другой адрес локального API. Служебные папки исключены из Git.

## Документация и развитие

[Услуги на месте](docs/marketplace-expansion.md) и [правила отзывов](docs/reviews.md) содержат более ранние решения. Актуальное устройство — в [карте](../docs/PROJECT-MAP.md), [диаграммах](../docs/diagrams/README.md) и [контексте GPT](../docs/BROWSER-GPT-CONTEXT.md). [Правила Codex](../AGENTS.md) находятся рядом с ними, вне этого репозитория. Ссылки доступны при наличии всей рабочей папки.

Документация фиксирует основу для нового направления; подготовка к защите отложена. При изменении сценария обновлять контракт API, отображаемые состояния и диаграмму вместе с реализацией. Сохранять адаптив, Safari/WebKit и `prefers-reduced-motion`.
