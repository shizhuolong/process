package org.apdplat.portal.channelManagement.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface FixedSalaryDao {

    public PageList<Map<String, Object>> list(Map<String, String> params) throws Exception;

    public PageList<Map<String, Object>> list1(Map<String, String> params);

    public void update(Map<String, String> params);

}
