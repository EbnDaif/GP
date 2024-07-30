# Base image
FROM gcc:latest

# Update and install Python and necessary tools
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    curl \
    gnupg \
    ca-certificates

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Clean up APT when done to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Symlink python to python3
RUN ln -s /usr/bin/python3 /usr/bin/python

# Create a working directory
WORKDIR /workspace

# Set the default command to bash
CMD ["/bin/bash"]
