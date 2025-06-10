package com.example.backend.Service;

import com.example.backend.Dto.LOLDto;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LOLCacheService {

    // 내부 캐시 맵 (key: 유저 고유 키, value: LOLDto와 타임스탬프 포함)
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    // 캐시 유효 시간 (밀리초) - 현재는 1시간
    private static final long EXPIRATION_TIME = 60 * 60 * 1000;

    // 캐시에 데이터 저장
    public void put(String key, LOLDto data) {
        cache.put(key, new CacheEntry(data));
    }

    // 캐시에서 유효한 데이터 가져오기 (없거나 만료되면 null 반환)
    public LOLDto get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry == null) return null;

        long now = System.currentTimeMillis();
        if (now - entry.timestamp > EXPIRATION_TIME) {
            cache.remove(key); // 만료되었으면 제거하고 null 반환
            return null;
        }

        return entry.data;
    }

    // 내부 클래스: 데이터와 저장 시각을 함께 보관
    private static class CacheEntry {
        private final LOLDto data;
        private final long timestamp;

        public CacheEntry(LOLDto data) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
    }
}
