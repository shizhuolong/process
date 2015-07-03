package org.apdplat.module.log.service;

import org.apdplat.module.log.model.OperateLog;
import org.apdplat.module.log.model.OperateLogType;
import org.apdplat.module.log.model.OperateStatistics;
import org.apdplat.module.security.model.User;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author sun
 */
public class OperateLogChartDataService {
    public static List<OperateStatistics> getData(List<OperateLog> models){
        Map<String,OperateStatistics> temp=new HashMap<>();
        //将日志数据转换为统计报表数据
        for(OperateLog item : models){
            String username=item.getUsername();
            if(username == null){
                username = "匿名用户";
            }            
            OperateStatistics sta=temp.get(username);
            if(sta==null){
                sta=new OperateStatistics();
                sta.setUsername(username);
                temp.put(username, sta);
            }
            if(OperateLogType.ADD.equals(item.getOperatingType())){
                sta.increaseAddCount();
            }
            if(OperateLogType.DELETE.equals(item.getOperatingType())){
                sta.increaseDeleteCount();
            }
            if(OperateLogType.UPDATE.equals(item.getOperatingType())){
                sta.increaseUpdateCount();
            }
        }
        List<OperateStatistics> data=new ArrayList<>();
        for(OperateStatistics item : temp.values()){
            data.add(item);
        }
        return data;
    }
}