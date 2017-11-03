package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.FixedSalaryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ImportFixedSalaryService {
    @Autowired
    private FixedSalaryDao fixedSalaryDao;
    
    public Object list(Map<String, String> params) throws Exception {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = fixedSalaryDao.list(params);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }

    public Object list1(Map<String, String> params) {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = fixedSalaryDao.list1(params);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }

    public void update(Map<String, String> params) {
        fixedSalaryDao.update(params);
    }
    
}
