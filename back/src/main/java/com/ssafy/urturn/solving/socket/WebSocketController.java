package com.ssafy.urturn.solving.socket;


import com.ssafy.urturn.global.util.MemberUtil;
import com.ssafy.urturn.member.service.MemberService;
import com.ssafy.urturn.solving.cache.cacheDatas;
import com.ssafy.urturn.solving.dto.roomInfoDto;
import com.ssafy.urturn.solving.dto.roomInfoResponse;
import com.ssafy.urturn.solving.dto.userInfoResponse;
import com.ssafy.urturn.solving.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;

import static com.ssafy.urturn.global.util.JsonUtil.convertObjectToJson;

@RestController
@RequiredArgsConstructor
public class WebSocketController {
    private final RoomService roomService;
    private final MemberService memberService;
    private final WebSocketSessionManager sessionManager;
    private final cacheDatas cachedatas;
    // 사용자가 데이터를 app/hello 경로로 데이터 날림.
    // 클라이언트는 /topic/greetings 주제를 구독하고 서버에서 이 주제로 메시지가 발행되면 이를 수신.


    @MessageMapping("/createRoom")
    public void createRoom() {

        Long userId=MemberUtil.getMemberId();

        roomInfoResponse roomInfo = roomService.createRoom();

        String roomInfoToJson= convertObjectToJson(roomInfo);
        userInfoResponse userInfo=memberService.getMemberInfo(userId);
        String userInfoToJson=convertObjectToJson(userInfo);
        sessionManager.sendMessage(userId,roomInfoToJson);
        sessionManager.sendMessage(userId,userInfoToJson);
    }

    @MessageMapping("/enter")
    public void enterRoom(@Payload String roomId) {
        roomInfoDto roominfodto=cachedatas.cacheroomInfoDto(roomId);

        Long managerId= roominfodto.getManagerId();
        Long participantId=roominfodto.getParticipantId();

        userInfoResponse managerInfo=memberService.getMemberInfo(managerId);
        userInfoResponse participantInfo=memberService.getMemberInfo(participantId);

        String managerInfoToJson=convertObjectToJson(managerInfo);
        String participantInfoToJson=convertObjectToJson(participantInfo);

        sessionManager.sendMessage(participantId,managerInfoToJson);
        sessionManager.sendMessage(managerId,participantInfoToJson);

    }



}
