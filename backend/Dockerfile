FROM php:8.2-cli-alpine

WORKDIR /app
COPY . /app

RUN mkdir -p /app/storage

CMD sh -c "mkdir -p /app/storage; [ -f /app/storage/users.json ] || echo '[]' > /app/storage/users.json; [ -f /app/storage/plans.json ] || echo '[]' > /app/storage/plans.json; [ -f /app/storage/materials.json ] || echo '[]' > /app/storage/materials.json; php -S 0.0.0.0:${PORT:-10000} -t public"