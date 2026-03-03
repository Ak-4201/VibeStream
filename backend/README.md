# Kodflix Auth Backend

Spring Boot backend for VibeStream/Kodflix authentication: signup, login, JWT.

## Default: H2 in-memory (no setup)

**Out of the box** the app uses an **H2 in-memory database**, so signup and login work without Aiven or any env vars. Just run the backend and use the frontend.

## Run (default H2)

```bash
mvn spring-boot:run
```

Or with Maven wrapper: `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`)

## Using Aiven MySQL

1. In [Aiven Console](https://console.aiven.io/), copy the **Service URI** (Host, Port) from the connection info.
2. **Allowlist**: Add your backend server’s (and dev machine’s) IP in the service allowlist.
3. Set env vars and run with profile `mysql`:

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST:PORT/defaultdb?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | e.g. `avnadmin` |
| `SPRING_DATASOURCE_PASSWORD` | Service password |
| `JWT_SECRET` | Min 32 chars for HS256 |
| `SERVER_PORT` | Optional; default `8080` |

```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://YOUR_HOST:YOUR_PORT/defaultdb?sslMode=REQUIRED"
export SPRING_DATASOURCE_USERNAME=avnadmin
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key-at-least-32-characters-long
mvn spring-boot:run -Dspring.profiles.active=mysql
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
