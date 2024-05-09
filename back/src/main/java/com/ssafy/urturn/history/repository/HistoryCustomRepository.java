package com.ssafy.urturn.history.repository;

import com.ssafy.urturn.history.dto.HistoryResponse;
import com.ssafy.urturn.history.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface HistoryCustomRepository {
    Page<HistoryResponse> getHistories(Long memberId, Pageable pageable);

    History getMostRecentHistoryByMemberId(Long memberId);
}
