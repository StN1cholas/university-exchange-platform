package com.example.university_exchange_platform.config; // Убедись, что пакет правильный

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Это наша "инструкция для охранника"
                registry.addMapping("/api/**") // Применять это правило ко всем ручкам, начинающимся с /api/
                        .allowedOrigins("*") // РАЗРЕШИТЬ запросы с ЛЮБОГО источника (для хакатона идеально)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Разрешить эти HTTP-методы
                        .allowedHeaders("*"); // Разрешить любые заголовки в запросе
            }
        };
    }
}