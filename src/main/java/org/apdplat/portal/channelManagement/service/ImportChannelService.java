package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.ImportChannelDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ImportChannelService {
    @Autowired
    private ImportChannelDao importChannelDao;

    public Object list(Map<String, String> params) {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = importChannelDao.list(params);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }

    public void addChannel(Map<String, String> params) {
        importChannelDao.addChannel(params);
    }

    public Map<String, Object> findById(String id) {
        return importChannelDao.findById(id);
    }

    public void updateChannel(Map<String, String> params) {
        importChannelDao.updateChannel(params);
    }
    
}
