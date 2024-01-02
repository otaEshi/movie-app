# Stage 1: Building the application
FROM python:3.10-slim-buster 
WORKDIR /app
RUN apt-get clean && apt-get update && apt-get install -y gcc 

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./main.py .
COPY ./images ./images
COPY ./sql ./sql
COPY ./.env .

# Add the command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]