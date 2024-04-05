FROM mcr.microsoft.com/playwright:v1.42.1-jammy

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV APP_NAME="react-nextjs"
ENV MAILINATOR_API_KEY=""

RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

ENTRYPOINT ["./entrypoint.sh"]