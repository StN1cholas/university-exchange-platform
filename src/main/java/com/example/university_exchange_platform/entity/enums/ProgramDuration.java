package com.example.university_exchange_platform.entity.enums;

public enum ProgramDuration {
    // Значения должны в точности совпадать с теми, что в БД
    // Spring автоматически преобразует их, но JPA требует @Enumerated
    // для правильного маппинга
    _3_МЕСЯЦА("3 месяца"),
    _6_МЕСЯЦЕВ("6 месяцев"),
    _9_МЕСЯЦЕВ("9 месяцев");

    private final String value;
    ProgramDuration(String value) { this.value = value; }
    public String getValue() { return value; }
}