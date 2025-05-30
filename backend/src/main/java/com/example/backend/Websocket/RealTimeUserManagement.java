package com.example.backend.Websocket;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
/*
*   본 클래스는 실시간으로 어떤 방에 어떤 유저가 입장했는지 추적을 위한 클래스이다
*   Map<String, Set<String>> activeUsersByRoom
*   방 Id : 유저 Id 형식으로 저장
*/
public class RealTimeUserManagement {

    public static Map<String, Set<String>> activeUsersByRoom = new ConcurrentHashMap<>();
}
