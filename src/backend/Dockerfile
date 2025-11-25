# Build Stage
FROM python:3.11-slim AS backend-build
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Production Stage
FROM python:3.11-slim
COPY --from=backend-build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-build /app /app
WORKDIR /app
EXPOSE 5000
CMD ["python", "backend.py"]