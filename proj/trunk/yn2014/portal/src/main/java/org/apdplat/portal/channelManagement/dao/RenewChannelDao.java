package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface RenewChannelDao {

    PageList<Map<String, Object>> list(Map<String, String> resultMap);

    void renew(Map<String, String> resultMap);

    PageList<Map<String, Object>> findByIds(Map<String, String> param);

    Map<String, Object> findById(String id);

}
