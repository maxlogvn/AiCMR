# Base image cho Python
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies - tách layer để tối ưu cache
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    libmagic1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file trước - chỉ rebuild khi thay đổi dependencies
COPY requirements.txt .

# Install Python dependencies với BuildKit cache mount
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

# Copy application code - rebuild khi thay đổi code
COPY . .

# Expose port 8000
EXPOSE 8000

# Command để chạy ứng dụng với hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
