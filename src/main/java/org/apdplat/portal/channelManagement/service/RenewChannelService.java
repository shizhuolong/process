package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.RenewChannelDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class RenewChannelService {
    @Autowired
    private RenewChannelDao renewChannelDao;
    
    public Object list(Map<String, String> resultMap) {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = renewChannelDao.list(resultMap);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }

    public Map<String, Object> findById(String id) {
        return renewChannelDao.findById(id);
    }

    @Transactional
    public void renew(Map<String, String> resultMap) throws Exception{
        Map<String, Object> map = renewChannelDao.findById(resultMap.get("id"));
        String end_month = map.get("END_MONTH").toString();
        String hzYear = map.get("HZ_YEAR").toString();
        int endMonth=Integer.parseInt(end_month.substring(0, 4))+1;
        end_month=endMonth+end_month.substring(4);
        int hz_year=Integer.parseInt(hzYear)+1;
        resultMap.put("end_month", end_month);
        resultMap.put("hz_year", Integer.toString(hz_year));
        renewChannelDao.renew(resultMap);
    }

    public Object findByIds(Map<String, String> param) {
        Map<String,Object> result = new HashMap<String,Object>();
        PageList<Map<String, Object>> rows = renewChannelDao.findByIds(param);
        result.put("rows", rows);
        result.put("pagin", rows.getPaginator());
        return result;
    }

}
