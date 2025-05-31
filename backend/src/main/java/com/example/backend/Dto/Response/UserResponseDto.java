package com.example.backend.Dto.Response;

import lombok.Getter;
import lombok.Setter;

// 반환되는 유저의 정보 DTO를 정의한다.
@Getter
@Setter
public class UserResponseDto {
    private String userId;
    private String userName;
    private String userEmail;
    private String userProfile;
}
