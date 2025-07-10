package com.example.university_exchange_platform.repository;

import com.example.university_exchange_platform.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Integer>, JpaSpecificationExecutor<Program> {
}