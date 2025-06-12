package com.example.backend.Dto;

import lombok.Data;
import java.util.List;

@Data
public class DNFDto {
    private String characterName;
    private String jobName;
    private int level;
    private String guildName;
    private int adventureFame;

    private List<DnfEquipmentDto> equipment;  // 여러 장비 정보

    @Override
    public String toString() {
        return "DNFDto{" +
                "characterName='" + characterName + '\'' +
                ", level=" + level +
                ", jobName='" + jobName + '\'' +
                ", guildName='" + guildName + '\'' +
                ", adventureFame=" + adventureFame +
                ", equipment=" + equipment +
                '}';
    }

}

