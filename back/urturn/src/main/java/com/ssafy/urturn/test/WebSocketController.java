package com.ssafy.urturn.test;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate template;

    // 사용자가 데이터를 app/hello 경로로 데이터 날림.
    // 클라이언트는 /topic/greetings 주제를 구독하고 서버에서 이 주제로 메시지가 발행되면 이를 수신.
    @MessageMapping("/hello")
    @SendTo("/topic/test")
    public String send(testDto testDto ) {
        System.out.println("Received message: " + testDto);
        return "Hello, " + testDto + "!";
    }

//    @MessageMapping("/hello")
//    @SendTo("/topic/test")
//    public String receive(String message) {
//        System.out.println("Received message: " + message);
//        return "Hello, " + message + "!";
//    }

    @PostMapping("/sendMessage")
    public void testSendMessage(){
        System.out.println("zz");
        template.convertAndSend("/topic/test", "Message 간다");
//        send("간다2");

    }
    @PostMapping("/receiveMessage")
    public void testreceiveMessage(){

    }
//    @Scheduled(fixedRate = 500)
//    @Scheduled void sendMessage(){
//        template.convertAndSend("/topic/greetings", "Message 간다");
//    }
}
