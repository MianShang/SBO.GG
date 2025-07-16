package com.example.backend.Dto;

import lombok.Data;
import java.util.List;

@Data
public class DNFDto {
    private String characterId; // 이미지를 가져오기 위해
    private String serverId; //
    private String characterName;
    private String jobName;
    private int level;
    private String guildName;
    private int adventureFame;

    private List<DnfEquipmentDto> equipment;  // 여러 장비 정보

    @Override
    public String toString() {
        return "DNFDto{" +
                "serverId='" + serverId + '\'' +
                ", characterId='" + characterId + '\'' +
                ", characterName='" + characterName + '\'' +
                ", level=" + level +
                ", jobName='" + jobName + '\'' +
                ", guildName='" + guildName + '\'' +
                ", adventureFame=" + adventureFame +
                ", equipment=" + equipment +
                '}';
    }

}

