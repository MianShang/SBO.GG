package com.example.backend.Dto.Response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ChatListResponseDto {
    private String name;
    private String message;
    private Date chatDate;
}
