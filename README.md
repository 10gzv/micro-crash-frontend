# Micro Crash Frontend (Pusulabet Crash)

Frontend for **Pusulabet Crash** (React + Vite + `@10gzv/crash-core`).

**Repository:** [github.com/10gzv/micro-crash-frontend](https://github.com/10gzv/micro-crash-frontend)

## Development

```bash
pnpm install
pnpm dev
```

Local assets (default in dev): `http://localhost:3000/`  
Optional: `?game_slug=pusulabet-crash` (default slug).  
Local assets (default): served from `/game_assets/<slug>/` (same origin, like base-crash).
CDN assets in dev/prod: `?assets=cdn`

Assets: `public/game_assets/pusulabet-crash/` — layout:

- `brand/` — logo, partner marks  
- `icons/header/` — chat, menu  
- `icons/menu/` — settings drawer  
- `icons/avatars/`, `icons/notice/`  
- `stage/` — compass, marker, rays  
- `audio/`, `fonts/`  

Paths are listed in `src/lego/constants/gameAssets.ts`.

## Build

```bash
pnpm build
pnpm preview
```

---

## New Git repository (first push)

Use this when the folder was copied from the old multi-game repo and you want a **clean history** only for Pusulabet Crash.

### 1. Create an empty repo on GitHub

1. GitHub → **New repository**
2. Name: `micro-crash-frontend`
3. **Do not** add README, `.gitignore`, or license (keep it empty)
4. Copy the repo URL, e.g. `https://github.com/10gzv/micro-crash-frontend.git`

### 2. In this project folder — new git history

If the folder still has the **old** remote/history and you want only the new game:

```bash
cd /Users/user/Desktop/ABRACADABRA/base-crash-frontend

# Remove old git link (does not delete your files)
rm -rf .git

git init
git branch -M main

# Optional: use org .gitignore for Node
curl -sL https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore -o .gitignore

git add .
git status   # check: no .env, no secrets

git commit -m "Initial commit: Pusulabet Crash frontend"
```

### 3. Push to the new remote

```bash
git remote add origin https://github.com/10gzv/micro-crash-frontend.git
git push -u origin main
```

SSH vs HTTPS:

```bash
# HTTPS
git remote add origin https://github.com/10gzv/micro-crash-frontend.git
```

### 4. If the folder already has `.git` and you want to **replace** remote only

```bash
git remote -v
git remote remove origin
git remote add origin https://github.com/10gzv/micro-crash-frontend.git
git push -u origin main
```

If the old remote already has commits and you need a **force** push to an empty new repo (only when the new GitHub repo is empty and you agreed to overwrite):

```bash
git push -u origin main --force
```

Avoid `--force` on shared `main` unless the team expects it.

### 5. CI / Docker

- Set `GITHUB_AUTH_TOKEN` in GitHub Actions secrets for `@10gzv/crash-core` (see `.npmrc`).
- Docker build unchanged: `docker build --build-arg GITHUB_AUTH_TOKEN=... .`

### 6. After push

- Update deploy URLs / launcher to point at the new repo
- Production serves `game_assets` from the app bundle (nginx `dist/game_assets/`). Optional CDN: `?assets=cdn` after syncing `public/game_assets/` to `assets.abcdabra.com`.
