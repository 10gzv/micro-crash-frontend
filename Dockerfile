FROM node:20 AS builder

# Token for the private GitHub Packages registry (@10gzv scope).
# Passed from CI: docker build --build-arg GITHUB_AUTH_TOKEN=$_GITHUB_AUTH_TOKEN
ARG GITHUB_AUTH_TOKEN
ENV GITHUB_AUTH_TOKEN=${GITHUB_AUTH_TOKEN}

# Repo is pnpm-managed (pnpm-lock.yaml); pin the version via corepack.
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY . .

WORKDIR /app/
RUN pnpm install --frozen-lockfile && pnpm run build

FROM nginx:latest

ARG WORKDIR_PATH=/home/user/project
WORKDIR ${WORKDIR_PATH}

COPY --from=builder /app /home/user/project

COPY ./nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
