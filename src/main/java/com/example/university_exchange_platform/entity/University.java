package com.example.university_exchange_platform.entity;

import jakarta.persistence.*;
import lombok.Data; // Удобная аннотация от Lombok

@Data // Генерирует геттеры, сеттеры, equals, hashCode, toString
@Entity
@Table(name = "universities") // Указываем, с какой таблицей связан этот класс
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Говорим, что ID генерируется базой данных
    private Integer id;

    @Column(name = "name", nullable = false) // Связываем поле с колонкой, nullable=false - не может быть пустым
    private String name;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "description")
    private String description;
}