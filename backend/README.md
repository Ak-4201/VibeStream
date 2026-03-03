# Kodflix Auth Backend

Spring Boot backend for VibeStream/Kodflix authentication: signup, login, JWT.

## Default: H2 in-memory (no setup)

**Out of the box** the app uses an **H2 in-memory database**, so signup and login work without Aiven or any env vars. Just run the backend and use the frontend.

## Run (default H2)

```bash
mvn spring-boot:run
```

Or with Maven wrapper: `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`)

## Using Aiven MySQL (Option A – recommended)

The project is configured for **streamweb-vibestream.d.aivencloud.com:12071/defaultdb** (user: `avnadmin`).

1. **Allowlist**: In Aiven Console, add your machine’s (or server’s) IP to the service allowlist.
2. From the **backend** folder, run the PowerShell script (sets env vars and starts the app):

```powershell
cd backend
.\run-with-mysql.ps1
```

The script sets `SPRING_PROFILES_ACTIVE=mysql` and `SPRING_DATASOURCE_PASSWORD` and runs `mvn spring-boot:run`.

**Or set env vars yourself and run:**

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:SPRING_DATASOURCE_PASSWORD = "your-aiven-password"   # From Aiven Console → service → Connection info
mvn spring-boot:run
```

## Requirements

- Java 17+
- Maven 3.8+

Or build and run the JAR:

```bash
./mvnw package -DskipTests
java -jar target/kodflix-auth-1.0.0.jar
```

## API

- `POST /api/auth/signup` – Register (body: userId, username, email, phoneNumber, password, confirmPassword). Returns JWT and user.
- `POST /api/auth/login` – Login (body: usernameOrEmail, password). Returns JWT and user.
- `GET /api/auth/me` – Current user (header: `Authorization: Bearer <token>`).

Passwords are stored as BCrypt hashes. Duplicate emails are rejected.
