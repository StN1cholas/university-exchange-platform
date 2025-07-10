package com.example.university_exchange_platform.controller;

import com.example.university_exchange_platform.service.FilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/filters") // Базовый URL для всех ручек в этом контроллере
@RequiredArgsConstructor
public class FilterController {

    private final FilterService filterService;

    @GetMapping("/cities")
    public List<String> getCities() {
        return filterService.getUniqueCities();
    }

    @GetMapping("/universities")
    public List<String> getUniversities() {
        return filterService.getUniqueUniversityNames();
    }

    @GetMapping("/languages")
    public List<String> getLanguages() {
        return filterService.getUniqueLanguages();
    }

    @GetMapping("/durations")
    public List<String> getDurations() {
        return filterService.getUniqueDurations();
    }

    @GetMapping("/fields-of-study")
    public List<String> getFieldsOfStudy() {
        return filterService.getUniqueFieldsOfStudy();
    }

    @GetMapping("/study-formats")
    public List<String> getStudyFormats() {
        return filterService.getUniqueStudyFormats();
    }
}