package org.apdplat.platform.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author sun
 */
public class EntityManagerHolder {
    private MultiDatabase multiDatabase;
    public EntityManagerHolder(MultiDatabase multiDatabase){
        this.multiDatabase=multiDatabase;
    }
    
    //遗憾的是：这里的unitName用不了配置文件中的变量了
    @PersistenceContext(unitName = "apdplat")
    private EntityManager em;
    @PersistenceContext(unitName = "apdplatForLog")
    private EntityManager emForLog;
    
    public EntityManager getEntityManager(){
        if(multiDatabase == MultiDatabase.APDPlat){
            return em;
        }
        if(multiDatabase == MultiDatabase.APDPlatForLog){
            return emForLog;
        }
        return em;
    }
}