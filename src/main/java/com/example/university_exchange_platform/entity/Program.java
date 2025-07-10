package com.example.university_exchange_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    // ИЗМЕНЕНО: name -> title
    @Column(name = "title", nullable = false)
    private String title;

    // ДОБАВЛЕНО:
    @Column(name = "competencies")
    private String competencies;

    // ДОБАВЛЕНО:
    @Column(name = "description")
    private String description;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "study_format")
    private String studyFormat; // Оставляем String для скорости

    @Column(name = "language", nullable = false)
    private String language;

    @Column(name = "duration")
    private String duration; // Оставляем String для скорости

    @Column(name = "min_gpa_required")
    private BigDecimal minGpaRequired;
}