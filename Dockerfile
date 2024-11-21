FROM debian:11.6-slim AS builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash -s "bun-v1.1.33"

COPY src src
COPY tsconfig.json .
COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production
RUN /root/.bun/bin/bun run build

# ? RUNNER
FROM gcr.io/distroless/base AS runner

WORKDIR /app

COPY --from=builder /app/dist/server server

ENV NODE_ENV=production
CMD ["./server"]

EXPOSE 5000
