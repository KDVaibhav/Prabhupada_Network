# First stage: Build
FROM node:20-alpine AS build

WORKDIR /backend

# Install dependencies for pnpm
RUN apk add --no-cache curl bash

# Install pnpm
RUN curl -fsSL https://get.pnpm.io/install.sh | env SHELL=bash sh && \
    export PNPM_HOME="/root/.local/share/pnpm" && \
    export PATH="$PNPM_HOME:$PATH" && \
    echo 'export PNPM_HOME="/root/.local/share/pnpm"' >> /root/.bashrc && \
    echo 'export PATH="$PNPM_HOME:$PATH"' >> /root/.bashrc && \
    pnpm --version

# Set ENV variables so PNPM is available
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy package.json and pnpm-lock.yaml first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the NestJS project
RUN pnpm run build

# Second stage: Production
FROM node:20-alpine AS production

WORKDIR /backend

# Install pnpm in the production stage
RUN apk add --no-cache curl bash && \
    curl -fsSL https://get.pnpm.io/install.sh | env SHELL=bash sh && \
    export PNPM_HOME="/root/.local/share/pnpm" && \
    export PATH="$PNPM_HOME:$PATH"

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy built app and dependencies
COPY --from=build /backend/package.json .
COPY --from=build /backend/pnpm-lock.yaml .
COPY --from=build /backend/node_modules ./node_modules
COPY --from=build /backend/dist ./dist

EXPOSE 5000

# Start application
CMD ["node", "dist/main.js"]
