package com.example.university_exchange_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration; // <-- ИМПОРТИРУЙ ЭТО

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class UniversityExchangePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniversityExchangePlatformApplication.class, args);
    }

}
