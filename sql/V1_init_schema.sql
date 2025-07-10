-- V1_init_schema_final.sql --

SET time zone 'UTC';

-- ENUM типы для данных
CREATE TYPE study_format_enum AS ENUM ('очно', 'заочно', 'очно-заочно');
CREATE TYPE program_duration_enum AS ENUM ('3 месяца', '6 месяцев', '9 месяцев'); -- ИЗМЕНЕНО
CREATE TYPE application_status_enum AS ENUM ('Подана', 'На рассмотрении', 'Требуются доп. документы', 'Одобрена', 'Отклонена');
CREATE TYPE user_role_enum AS ENUM ('ROLE_STUDENT', 'ROLE_UNIVERSITY_REP', 'ROLE_ADMIN');

-- Таблица вузов
CREATE TABLE universities (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(255) NOT NULL,
                              city VARCHAR(100) NOT NULL,
                              country VARCHAR(100) NOT NULL,
                              description TEXT
);

-- Таблица программ обмена
CREATE TABLE programs (
                          id SERIAL PRIMARY KEY,
                          university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
                          name VARCHAR(255) NOT NULL,
                          field_of_study VARCHAR(255),
                          study_format study_format_enum,
                          language VARCHAR(50) NOT NULL,
                          duration program_duration_enum, -- ИЗМЕНЕНО
                          min_gpa_required NUMERIC(3, 2)
);

-- Таблица дисциплин
CREATE TABLE disciplines (
                             id SERIAL PRIMARY KEY,
                             program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
                             name VARCHAR(255) NOT NULL,
                             description TEXT,
                             credits INTEGER
);

-- БЛОК АУТЕНТИФИКАЦИИ (без изменений)
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role user_role_enum NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
                          id SERIAL PRIMARY KEY,
                          user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          first_name VARCHAR(100),
                          last_name VARCHAR(100),
                          home_university_name VARCHAR(255),
                          current_gpa NUMERIC(3, 2)
);

CREATE TABLE university_representatives (
                                            id SERIAL PRIMARY KEY,
                                            user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                            university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
                                            first_name VARCHAR(100),
                                            last_name VARCHAR(100),
                                            job_title VARCHAR(255)
);

-- БЛОК БИЗНЕС-ЛОГИКИ (без изменений)
CREATE TABLE applications (
                              id SERIAL PRIMARY KEY,
                              student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                              program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
                              status application_status_enum NOT NULL DEFAULT 'Подана',
                              calculated_rank INTEGER,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска по фильтрам (без изменений)
CREATE INDEX idx_programs_city ON universities(city);
CREATE INDEX idx_programs_language ON programs(language);
CREATE INDEX idx_programs_field_of_study ON programs(field_of_study);