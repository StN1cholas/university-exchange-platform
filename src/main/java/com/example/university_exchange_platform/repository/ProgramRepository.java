//package com.example.university_exchange_platform.repository;
//
//import com.example.university_exchange_platform.entity.Program;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface ProgramRepository extends JpaRepository<Program, Integer>, JpaSpecificationExecutor<Program> {
//}

package com.example.university_exchange_platform.repository;

import com.example.university_exchange_platform.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Integer>, JpaSpecificationExecutor<Program> {

    // --- Методы для получения уникальных значений для фильтров ---

    @Query("SELECT DISTINCT p.university.city FROM Program p WHERE p.university.city IS NOT NULL ORDER BY p.university.city")
    List<String> findDistinctCities();

    @Query("SELECT DISTINCT p.university.name FROM Program p WHERE p.university.name IS NOT NULL ORDER BY p.university.name")
    List<String> findDistinctUniversityNames();

    @Query("SELECT DISTINCT p.language FROM Program p WHERE p.language IS NOT NULL ORDER BY p.language")
    List<String> findDistinctLanguages();

    @Query("SELECT DISTINCT p.duration FROM Program p WHERE p.duration IS NOT NULL ORDER BY p.duration")
    List<String> findDistinctDurations();

    @Query("SELECT DISTINCT p.fieldOfStudy FROM Program p WHERE p.fieldOfStudy IS NOT NULL ORDER BY p.fieldOfStudy")
    List<String> findDistinctFieldsOfStudy();

    @Query("SELECT DISTINCT p.studyFormat FROM Program p WHERE p.studyFormat IS NOT NULL ORDER BY p.studyFormat")
    List<String> findDistinctStudyFormats();
}