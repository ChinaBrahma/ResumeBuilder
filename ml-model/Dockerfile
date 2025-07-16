# Base Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for packages like spaCy
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Download spaCy model AFTER installing spaCy
RUN python -m spacy download en_core_web_sm

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 5002

# ✅ Use gunicorn to run the app
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "app:app"]
