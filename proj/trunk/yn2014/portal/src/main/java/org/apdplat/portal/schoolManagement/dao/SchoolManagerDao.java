package org.apdplat.portal.schoolManagement.dao;

import java.util.List;
import java.util.Map;










import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface SchoolManagerDao {
    public List<Map<String, Object>> findSchoolName(Map<String, String> param);

    public Map<String, Object> findSchoolByID(Map<String, String> param);
    
}
