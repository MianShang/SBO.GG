package com.example.backend.Dto.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameCodeRequestDto {
    private String userId;
    private String gameName;
    private String gameCode;

}
