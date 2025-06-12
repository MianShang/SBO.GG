package com.example.backend.Config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class RiotApiConfig {
    @Value("${riot.api-key}")       // 저장된 API 키 가져오기
    private String apiKey;
}
