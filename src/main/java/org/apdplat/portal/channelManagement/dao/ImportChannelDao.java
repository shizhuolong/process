package org.apdplat.portal.channelManagement.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ImportChannelDao {

    PageList<Map<String, Object>> list(Map<String, String> params);

    void addChannel(Map<String, String> params);

    Map<String, Object> findById(String id);

    void updateChannel(Map<String, String> params);

}
