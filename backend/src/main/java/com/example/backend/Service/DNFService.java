package com.example.backend.Service;

import com.example.backend.Config.DnfApiConfig;
import com.example.backend.Dto.DNFDto;
import com.example.backend.Dto.DnfEquipmentDto;
import com.example.backend.Dto.DnfCharacterIdDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DNFService {

    private final DnfApiConfig dnfconfig;
    private final RestTemplate restTemplate;

    public DNFDto getDNF(String serverId, String nickname) {

        serverId = convertServerNameToId(serverId);
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", dnfconfig.getApiKey());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        DNFDto dto = new DNFDto();

        try {
            // 1. 캐릭터 ID 조회

            String idUrl = "https://api.neople.co.kr/df/servers/" + serverId + "/characters?characterName=" + nickname + "&apikey=" + dnfconfig.getApiKey();

            ResponseEntity<DnfCharacterIdDto> idResponse = restTemplate.exchange(
                    idUrl, HttpMethod.GET, entity, DnfCharacterIdDto.class);


            System.out.println("캐릭터 ID 응답 원문: " + idResponse.getBody());

            if (idResponse.getBody() == null || idResponse.getBody().getRows() == null || idResponse.getBody().getRows().isEmpty()) {
                System.out.println("캐릭터를 찾을 수 없습니다: " + nickname);
                return null;
            }


            String characterId = idResponse.getBody().getRows().get(0).getCharacterId();
            String correctedServerId = idResponse.getBody().getRows().get(0).getServerId();

            dto.setCharacterId(characterId);
            dto.setServerId(correctedServerId);

            // 2. 장착 장비 API 호출
            String equipUrl = "https://api.neople.co.kr/df/servers/" + serverId + "/characters/" + characterId + "/equip/equipment?apikey=" + dnfconfig.getApiKey();

            ResponseEntity<String> equipResponse = restTemplate.exchange(
                    equipUrl, HttpMethod.GET, entity, String.class);

            String responseBody = equipResponse.getBody();
            if (responseBody == null) {
                throw new RuntimeException("장비 API 응답이 null입니다.");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);

            System.out.println("응답 원문: " + responseBody);
            System.out.println("level: " + root.path("level").asText());
            System.out.println("equipment: " + root.path("equipment"));

            dto.setCharacterName(root.path("characterName").asText());
            dto.setLevel(root.path("level").asInt());
            dto.setJobName(root.path("jobName").asText());
            dto.setGuildName(root.path("guildName").asText());
            dto.setAdventureFame(root.path("fame").asInt());

            List<DnfEquipmentDto> list = new ArrayList<>();
            for (JsonNode item : root.path("equipment")) {
                DnfEquipmentDto eq = new DnfEquipmentDto();
                eq.setItemName(item.path("itemName").asText());
                eq.setItemType(item.path("itemType").asText());
                eq.setItemRarity(item.path("itemRarity").asText());
                eq.setSlotName(item.path("slotName").asText());
                eq.setItemId(item.path("itemId").asText());
                eq.setReinforce(item.path("reinforce").asInt());
                eq.setAmplificationName(item.path("amplificationName").asText(null));
                list.add(eq);
            }

            dto.setEquipment(list);

            System.out.println("최종 DNFDto: " + dto);


        } catch (Exception e) {
            System.out.println("예외 발생: " + e.getMessage());
            e.printStackTrace();
            return null;
        }

        return dto;
    }


    //한글 서버 이름으로 변환
    private String convertServerNameToId(String koreanName) {
        return switch (koreanName.trim()) {
            case "카인" -> "cain";
            case "디레지에" -> "diregie";
            case "시로코" -> "siroco";
            case "프레이" -> "prey";
            case "카시야스" -> "casillas";
            case "힐더" -> "hilder";
            case "안톤" -> "anton";
            case "바칼" -> "bakal";
            default -> throw new IllegalArgumentException("알 수 없는 서버 이름: " + koreanName);
        };
    }

}
