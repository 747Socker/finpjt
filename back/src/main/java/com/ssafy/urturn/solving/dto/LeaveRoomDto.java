package com.ssafy.urturn.solving.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class LeaveRoomDto {

    private String roomId;

    @JsonProperty("isHost")
    private boolean isHost;
}
