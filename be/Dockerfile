# Stage 1: Building the application
FROM python:3.10
WORKDIR /app
RUN apt-get clean && apt-get update && apt-get install -y gcc 
# Copy the requirements file
COPY ./requirements.txt .
COPY ./main.py .
COPY ./images ./images
COPY ./sql ./sql
COPY ./alembic ./alembic
COPY ./alembic.ini .

# Install python dependencies
RUN pip install -r requirements.txt
# Add the command to run the application
# RUN alembic upgrade head
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]