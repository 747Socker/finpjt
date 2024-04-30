package com.ssafy.urturn.solving.cache;

import com.ssafy.urturn.solving.dto.roomInfoDto;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class cacheDatas {

    // entrycode를 키로 하여 roomId를 roomIdCache라는 이름의 캐시에 저장.
    @CachePut(value = "roomIdCache", key="#entrycode")
    public String cacheRoomId(String entrycode, String roomId) {
        return roomId;
    }

    @Cacheable(value ="roomIdCache", key="#entrycode")
    public String cacheRoomId(String entrycode) {
        return null;
    }

    @CachePut(value = "roomInfoDtoCache", key="#roomId")
    public roomInfoDto cacheroomInfoDto(String roomId, roomInfoDto roomInfoDto){
        return roomInfoDto;
    }

    @Cacheable(value = "roomInfoDtoCache", key="#roomId")
    public roomInfoDto cacheroomInfoDto(String roomId){
        return null;
    }

}
