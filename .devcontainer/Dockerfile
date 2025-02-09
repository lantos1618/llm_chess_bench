# Use Ubuntu as the base image
FROM ubuntu:latest

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    build-essential \
    pkg-config \
    zip \
    unzip \
    zsh \
    && rm -rf /var/lib/apt/lists/*


# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# register bun to bash
RUN echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

# Install node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Add NVM to shell and install Node LTS
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install --lts

# Create workspace directory
RUN mkdir -p /workspaces

# Set working directory
WORKDIR /workspaces

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog 