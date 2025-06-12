package com.example.backend.Config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@Data
public class DnfApiConfig {
    @Value("${dnf.api-key}")
    private String apiKey;

    @Bean
    public RestTemplate restTemplate() {

        return new RestTemplate();

    }


}


