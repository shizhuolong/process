package org.apdplat.portal.schoolManagement.dao;

import java.util.List;
import java.util.Map;
















import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface SchoolPioneerDao {
   
    public List<Map<String, Object>> listTree();

    public void addHead(Map<String, String> resultMap);

    public List<Map<String, Object>> listSchool(Map<String, String> param);
    
}
