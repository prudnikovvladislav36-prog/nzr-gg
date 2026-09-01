# NZR.GG Admin Publisher v0.8

Админка доступна по адресу:

`/admin/`

На GitHub Pages текущего проекта это будет:

`https://prudnikovvladislav36-prog.github.io/nzr-gg/admin/`

## Что умеет

- создать NEWS / ESPORTS / UPDATES / INDUSTRY;
- автоматически сформировать slug;
- загрузить собственную обложку;
- добавить теги;
- написать текст статьи через форму;
- создать черновик или сразу опубликовать;
- показать предпросмотр;
- напрямую записать материал в `content.js` через GitHub API;
- после commit GitHub Pages сам обновляет сайт.

## Авторизация

В код сайта GitHub token НЕ записывается.

Администратор вводит Fine-grained Personal Access Token непосредственно в форме. Он используется только для запросов к `api.github.com` во время текущей страницы.

Рекомендуемые права токена:
- Repository access: `Only select repositories` → `nzr-gg`
- Repository permissions → Contents: `Read and write`
- Metadata: Read-only (назначается автоматически)

Не используйте classic token с доступом ко всем репозиториям.

## Важное ограничение

Это практичная админка для текущего статического GitHub Pages, но это ещё не production-auth система.
Адрес `/admin/` публично доступен, однако без GitHub-токена публиковать ничего нельзя.

Позже при переносе NZR.GG на полноценный backend эту форму можно сохранить, заменив GitHub token на обычный логин администратора.
