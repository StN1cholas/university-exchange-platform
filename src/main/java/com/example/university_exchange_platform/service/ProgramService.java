////package com.example.university_exchange_platform.service; // <- правильный пакет
////
////import com.example.university_exchange_platform.dto.ProgramDto;
////import com.example.university_exchange_platform.entity.Program;
////import com.example.university_exchange_platform.repository.ProgramRepository;
////import jakarta.persistence.criteria.Predicate;
////import lombok.RequiredArgsConstructor;
////import org.springframework.data.jpa.domain.Specification;
////import org.springframework.stereotype.Service;
////import java.math.BigDecimal;
////import java.util.ArrayList;
////import java.util.List;
////import java.util.stream.Collectors;
////
////@Service
////@RequiredArgsConstructor
////public class ProgramService {
////
////    private final ProgramRepository programRepository;
////
////    public List<ProgramDto> findProgramsByFilters(String city, String language, String duration, String fieldOfStudy, BigDecimal minGpa) {
////
////        Specification<Program> spec = (root, query, criteriaBuilder) -> {
////            List<Predicate> predicates = new ArrayList<>();
////
////            if (city != null && !city.isBlank()) {
////                predicates.add(criteriaBuilder.equal(root.get("university").get("city"), city));
////            }
////            if (language != null && !language.isBlank()) {
////                predicates.add(criteriaBuilder.equal(root.get("language"), language));
////            }
////            if (duration != null && !duration.isBlank()) {
////                predicates.add(criteriaBuilder.equal(root.get("duration"), duration));
////            }
////            if (fieldOfStudy != null && !fieldOfStudy.isBlank()) {
////                predicates.add(criteriaBuilder.like(root.get("fieldOfStudy"), "%" + fieldOfStudy + "%"));
////            }
////            if (minGpa != null) {
////                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("minGpaRequired"), minGpa));
////            }
////
////            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
////        };
////
////        List<Program> programs = programRepository.findAll(spec);
////
////        return programs.stream()
////                .map(this::mapToDto)
////                .collect(Collectors.toList());
////    }
////
////    private ProgramDto mapToDto(Program program) {
////        return ProgramDto.builder()
////                .id(program.getId())
////                .title(program.getTitle())
////                .fieldOfStudy(program.getFieldOfStudy())
////                .universityName(program.getUniversity().getName())
////                .city(program.getUniversity().getCity())
////                .language(program.getLanguage())
////                .duration(program.getDuration())
////                .description(program.getDescription())
////                .minGpaRequired(program.getMinGpaRequired())
////                .competencies(program.getCompetencies())
////                .build();
////    }
////}
//
//package com.example.university_exchange_platform.service;
//
//import com.example.university_exchange_platform.dto.ProgramDto;
//import com.example.university_exchange_platform.entity.Program;
//import com.example.university_exchange_platform.repository.ProgramRepository;
//import jakarta.persistence.criteria.Predicate;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class ProgramService {
//
//    private final ProgramRepository programRepository;
//
//    public List<ProgramDto> findProgramsByFilters(
//            List<String> universityNames, String city, String language,
//            String duration, String studyFormat, String fieldOfStudy, BigDecimal minGpa
//    ) {
//
//        // Specification - это мощный способ строить динамические запросы
//        Specification<Program> spec = (root, query, criteriaBuilder) -> {
//            List<Predicate> predicates = new ArrayList<>();
//
//            // 1. Фильтр по списку университетов
//            if (universityNames != null && !universityNames.isEmpty()) {
//                predicates.add(root.get("university").get("name").in(universityNames));
//            }
//
//            // 2. Фильтр по городу (с обработкой формата "г. Москва, ...")
//            if (city != null && !city.isBlank()) {
//                String cleanCity = city.split(",")[0].replace("г.", "").trim();
//                // Делаем и значение из базы, и значение из запроса маленькими буквами перед сравнением
//                predicates.add(criteriaBuilder.equal(
//                        criteriaBuilder.lower(root.get("university").get("city")),
//                        cleanCity.toLowerCase()
//                ));
//            }
//
//            // 3. Фильтр по языку
//            if (language != null && !language.isBlank()) {
//                predicates.add(criteriaBuilder.equal(root.get("language"), language));
//            }
//
//            // 4. Фильтр по длительности
//            if (duration != null && !duration.isBlank()) {
//                predicates.add(criteriaBuilder.equal(root.get("duration"), duration));
//            }
//
//            // 5. Фильтр по форме обучения
//            if (studyFormat != null && !studyFormat.isBlank()) {
//                predicates.add(criteriaBuilder.equal(root.get("studyFormat"), studyFormat));
//            }
//
//            // 6. Фильтр по направлению (поиск по частичному совпадению)
//            if (fieldOfStudy != null && !fieldOfStudy.isBlank()) {
//                predicates.add(criteriaBuilder.like(root.get("fieldOfStudy"), "%" + fieldOfStudy + "%"));
//            }
//
//            // 7. Фильтр по GPA. Логика: мы ищем программы, требуемый GPA которых НЕ ВЫШЕ, чем тот, что выбрал пользователь.
//            if (minGpa != null) {
//                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("minGpaRequired"), minGpa));
//            }
//
//            // Собираем все условия вместе через "И"
//            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
//        };
//
//        // Выполняем запрос
//        List<Program> programs = programRepository.findAll(spec);
//
//        // Преобразуем результат в DTO для отправки на фронт
//        return programs.stream()
//                .map(this::mapToDto)
//                .collect(Collectors.toList());
//    }
//
//    private ProgramDto mapToDto(Program program) {
//        return ProgramDto.builder()
//                .id(program.getId())
//                .title(program.getTitle())
//                .competencies(program.getCompetencies())
//                .description(program.getDescription())
//                .fieldOfStudy(program.getFieldOfStudy())
//                .universityName(program.getUniversity().getName())
//                .city(program.getUniversity().getCity())
//                .language(program.getLanguage())
//                .duration(program.getDuration())
//                .minGpaRequired(program.getMinGpaRequired())
//                .build();
//    }
//}

package com.example.university_exchange_platform.service;

import com.example.university_exchange_platform.dto.ProgramDto;
import com.example.university_exchange_platform.entity.Program;
import com.example.university_exchange_platform.repository.ProgramRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;

    public List<ProgramDto> findProgramsByFilters(
            List<String> universityNames, List<String> cities, List<String> languages,
            List<String> durations, List<String> studyFormats, List<String> fieldOfStudy, BigDecimal minGpa
    ) {

        Specification<Program> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (universityNames != null && !universityNames.isEmpty()) {
                predicates.add(root.get("university").get("name").in(universityNames));
            }

            // Фильтр по списку городов
            if (cities != null && !cities.isEmpty()) {
                List<String> cleanCities = cities.stream()
                        .map(c -> c.split(",")[0].replace("г.", "").trim().toLowerCase())
                        .collect(Collectors.toList());
                predicates.add(criteriaBuilder.lower(root.get("university").get("city")).in(cleanCities));
            }

            // Фильтр по списку языков
            if (languages != null && !languages.isEmpty()) {
                predicates.add(root.get("language").in(languages));
            }

            // Фильтр по списку длительностей
            if (durations != null && !durations.isEmpty()) {
                predicates.add(root.get("duration").in(durations));
            }

            // Фильтр по списку форм обучения
            if (studyFormats != null && !studyFormats.isEmpty()) {
                predicates.add(root.get("studyFormat").in(studyFormats));
            }

            // Фильтр по списку направлений (поиск по частичному совпадению для каждого)
            if (fieldOfStudy != null && !fieldOfStudy.isEmpty()) {
                List<Predicate> fieldOfStudyPredicates = fieldOfStudy.stream()
                        .filter(fos -> fos != null && !fos.isBlank())
                        .map(fos -> criteriaBuilder.like(criteriaBuilder.lower(root.get("fieldOfStudy")), "%" + fos.toLowerCase() + "%"))
                        .collect(Collectors.toList());

                if (!fieldOfStudyPredicates.isEmpty()) {
                    predicates.add(criteriaBuilder.or(fieldOfStudyPredicates.toArray(new Predicate[0])));
                }
            }

            if (minGpa != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("minGpaRequired"), minGpa));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<Program> programs = programRepository.findAll(spec);

        return programs.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProgramDto mapToDto(Program program) {
        return ProgramDto.builder()
                .id(program.getId())
                .title(program.getTitle())
                .competencies(program.getCompetencies())
                .description(program.getDescription())
                .fieldOfStudy(program.getFieldOfStudy())
                .universityName(program.getUniversity().getName())
                .city(program.getUniversity().getCity())
                .language(program.getLanguage())
                .duration(program.getDuration())
                .minGpaRequired(program.getMinGpaRequired())
                .build();
    }
}