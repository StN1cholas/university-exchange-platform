package com.example.university_exchange_platform.service;

import com.example.university_exchange_platform.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FilterService {

    private final ProgramRepository programRepository;

    public List<String> getUniqueCities() {
        return programRepository.findDistinctCities();
    }

    public List<String> getUniqueUniversityNames() {
        return programRepository.findDistinctUniversityNames();
    }

    public List<String> getUniqueLanguages() {
        return programRepository.findDistinctLanguages();
    }

    public List<String> getUniqueDurations() {
        return programRepository.findDistinctDurations();
    }

    public List<String> getUniqueFieldsOfStudy() {
        return programRepository.findDistinctFieldsOfStudy();
    }

    public List<String> getUniqueStudyFormats() {
        return programRepository.findDistinctStudyFormats();
    }
}