package com.example.backend.Dto;

import lombok.Data;

import java.util.List;

@Data
public class DnfCharacterIdDto {
    private List<Row> rows;

    @Data
    public static class Row {
        private String characterId;
        private String serverId;
    }
}
