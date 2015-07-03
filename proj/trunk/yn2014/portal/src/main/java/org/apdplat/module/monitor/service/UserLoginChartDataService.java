package org.apdplat.module.monitor.service;

import org.apdplat.module.monitor.model.UserLogin;
import org.apdplat.module.security.model.User;
import java.util.LinkedHashMap;
import java.util.List;

/**
 *
 * @author sun
 */
public class UserLoginChartDataService {
  
    public static LinkedHashMap<String,Long> getUserOnlineTime(List<UserLogin> models){        
        LinkedHashMap<String,Long> temp=new LinkedHashMap<>();
        //将日志数据转换为统计报表数据
        for(UserLogin item : models){
            String username=item.getUsername();
            if(username == null){
                username = "匿名用户";
            }            
            Long value=temp.get(username);
            if(value==null){
                value=item.getOnlineTime();
            }else{
                value+=item.getOnlineTime();
            }
            temp.put(username, value);
        }
        return temp;
    }
    /**
     * 统计用户登录次数
     * @param models 用户登录日志
     * @return  以用户名为KEY，以登录次数为VALUE的MAP
     */
    public static LinkedHashMap<String,Long> getUserLoginTimes(List<UserLogin> models){
        LinkedHashMap<String,Long> temp=new LinkedHashMap<>();
        //将日志数据转换为统计报表数据
        for(UserLogin item : models){
            String username=item.getUsername();
            if(username == null){
                username = "匿名用户";
            }
            
            Long value=temp.get(username);
            if(value==null){
                value=1l;
            }else{
                value++;
            }
            temp.put(username, value);
        }
        return temp;
    }  
}