package com.example.university_exchange_platform.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder // Удобный паттерн "Строитель" для создания объектов
public class ProgramDto {
    private Integer id;
    private String title;
    private String competencies;
    private String description;
    private String universityName;
    private String fieldOfStudy;
    private String city;
    private String language;
    private String duration;
    private BigDecimal minGpaRequired;
}