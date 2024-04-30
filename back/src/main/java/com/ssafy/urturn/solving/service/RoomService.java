package com.ssafy.urturn.solving.service;

import com.ssafy.urturn.global.util.MemberUtil;
import com.ssafy.urturn.member.service.MemberService;
import com.ssafy.urturn.solving.cache.cacheDatas;
import com.ssafy.urturn.solving.dto.RoomStatus;
import com.ssafy.urturn.solving.dto.roomInfoDto;
import com.ssafy.urturn.solving.dto.roomInfoResponse;
import com.ssafy.urturn.solving.temp.WebSocketSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final MemberService memberService;
    private final cacheDatas cachedatas;
    private final WebSocketSessionManager webSocketSessionManager;
    /*
    방생성
     */
    public roomInfoResponse createRoom(){
        // 방 ID
        String roomId= UUID.randomUUID().toString();
        // 입장코드
        String entryCode=UUID.randomUUID().toString().substring(0,6);

        // 방 정보 DTO 생성
        roomInfoDto roominfodto=new roomInfoDto();
        roominfodto.setManagerId(MemberUtil.getMemberId());
        roominfodto.setRoomStatus(RoomStatus.WAITING);

        // 초대코드 키로 방 ID 캐시
        cachedatas.cacheRoomId(entryCode,roomId);

        // 방 ID 키로 방정보 캐시
        cachedatas.cacheroomInfoDto(roomId,roominfodto);

        return new roomInfoResponse(roomId, entryCode, true);

    }

    public String canEnterRoom(String entryCode){
        /*
        cacheRoomId 가 null 인 경우 에러 메시지 반환.
        null이 아닌 경우 cacheroomInfoDto 메서드로 방 정보 가져 옴.
         */
        roomInfoDto roomInfo = Optional.ofNullable(cachedatas.cacheRoomId(entryCode))
                .map(cachedatas::cacheroomInfoDto)
                .orElseThrow(() -> new RuntimeException("해당 방이 존재하지 않습니다."));

        if (roomInfo.getRoomStatus() != RoomStatus.WAITING) {
            throw new RuntimeException("해당 방은 " + roomInfo.getRoomStatus() + " 상태입니다.");
        }

        // 방에 참여자 ID 저장.
        roomInfo.setParticipantId(MemberUtil.getMemberId());  // 추후 토큰에서 추출하는 것으로 변경 예정
        return cachedatas.cacheRoomId(entryCode);


    }


}
