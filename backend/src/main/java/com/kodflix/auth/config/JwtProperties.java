package com.kodflix.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private static final String DEFAULT_SECRET = "vibestream-default-jwt-secret-key-at-least-32-bytes-long-for-hs256";
    private String secret = DEFAULT_SECRET;
    private long expirationMs = 86400000;

    public String getSecret() {
        if (secret == null || secret.isBlank()) return DEFAULT_SECRET;
        return secret.length() >= 32 ? secret : DEFAULT_SECRET;
    }
    public void setSecret(String secret) { this.secret = secret; }
    public long getExpirationMs() { return expirationMs; }
    public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
}
