package org.apdplat.module.module.service;

import java.util.HashMap;
import org.apdplat.platform.log.APDPlatLogger;

/**
 *
 * @author sun
 */
public class ModuleCache {
    private static final APDPlatLogger LOG = new APDPlatLogger(ModuleCache.class);
    private static final HashMap<String,String> cache=new HashMap<>();
    private ModuleCache(){}
    
    public static void put(String key, String value){
        cache.put(key, value);
    }
    public static String get(String key){
        return cache.get(key);
    }    
    public static void clear(){
        cache.clear();
        LOG.info("清空缓存");
    }
}