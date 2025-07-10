package com.example.university_exchange_platform.service; // <- правильный пакет

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

    public List<ProgramDto> findProgramsByFilters(String city, String language, String duration, String fieldOfStudy, BigDecimal minGpa) {

        Specification<Program> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("university").get("city"), city));
            }
            if (language != null && !language.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("language"), language));
            }
            if (duration != null && !duration.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("duration"), duration));
            }
            if (fieldOfStudy != null && !fieldOfStudy.isBlank()) {
                predicates.add(criteriaBuilder.like(root.get("fieldOfStudy"), "%" + fieldOfStudy + "%"));
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
                .fieldOfStudy(program.getFieldOfStudy())
                .universityName(program.getUniversity().getName())
                .city(program.getUniversity().getCity())
                .language(program.getLanguage())
                .duration(program.getDuration())
                .description(program.getDescription())
                .minGpaRequired(program.getMinGpaRequired())
                .competencies(program.getCompetencies())
                .build();
    }
}