# PDF Processor – Backend Service

## Overview
PDF Processor is a backend service that handles PDF file uploads and performs server-side processing such as data extraction.
This service exposes REST APIs that can be consumed by any frontend or client application.

---

## Features
- Upload PDF files via REST API
- Server-side PDF processing
- Input validation and error handling
- Modular and maintainable code structure

---

## Tech Stack
- Framework: React
- Build Tool: Vite
- Language: JavaScript
- Styling: CSS
- API Style: REST
- Version Control: Git & GitHub

---


---

## API Endpoints
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/pdf/process` | Process the uploaded PDF and returns a job id |
| GET  | `/api/pdf/status/{id}` | Check processing status |

---

## How to Run
1. Clone the repository:
```bash
git clone https://github.com/<your-username>/PDF_Processor.git
```
2. Navigate to the project directory:
```bash
cd PDF_Processor
```
3.Run the application:
```bash
mvn spring-boot:run
```
4.The server will start at:
```arduino
http://localhost:8080
```

---

## Testing

- APIs can be tested using Postman or cURL
- Upload valid PDF files to verify functionality
- Proper error responses are returned

---

## Author
Ishika R Dev

---
