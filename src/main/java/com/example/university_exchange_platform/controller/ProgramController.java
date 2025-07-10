//package com.example.university_exchange_platform.controller;
//
//import com.example.university_exchange_platform.dto.ProgramDto;
//import com.example.university_exchange_platform.service.ProgramService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/programs") // Базовый URL для всех ручек в этом контроллере
//@RequiredArgsConstructor // От Lombok: создает конструктор для всех final полей
//public class ProgramController {
//
//    private final ProgramService programService; // Внедряем сервис
//
//    @GetMapping // Эта ручка будет отвечать на GET-запросы
//    public List<ProgramDto> getPrograms(
//            // @RequestParam делает параметр URL доступным в методе
//            // required = false означает, что параметр не обязателен
//            @RequestParam(required = false) String city,
//            @RequestParam(required = false) String language,
//            @RequestParam(required = false) String duration,
//            @RequestParam(name = "fieldOfStudy", required = false) String fieldOfStudy,
//            @RequestParam(name = "minGpa", required = false) BigDecimal minGpa
//    ) {
//        // Просто передаем все параметры в сервис, который сделает всю работу
//        return programService.findProgramsByFilters(city, language, duration, fieldOfStudy, minGpa);
//    }
//}

package com.example.university_exchange_platform.controller;

import com.example.university_exchange_platform.dto.ProgramDto;
import com.example.university_exchange_platform.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping
    public List<ProgramDto> getPrograms(
            // Этот параметр теперь может приходить несколько раз
            @RequestParam(required = false) List<String> universityName,
            @RequestParam(required = false) List<String> city,
            @RequestParam(required = false) List<String> language,
            @RequestParam(required = false) List<String> duration,
            @RequestParam(required = false) List<String> studyFormat,
            @RequestParam(required = false) List<String> fieldOfStudy,
            // Фронтенд называет это "grade", но для бэка это GPA
            @RequestParam(name = "grade", required = false) BigDecimal minGpa
    ) {
        // Просто передаем все в сервис
        return programService.findProgramsByFilters(universityName, city, language, duration, studyFormat, fieldOfStudy, minGpa);
    }
}