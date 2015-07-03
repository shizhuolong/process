package org.apdplat.platform.common;

import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.model.Model;
import javax.persistence.Entity;
import org.apdplat.platform.dao.EntityManagerHolder;
import org.apdplat.platform.dao.MultiDatabase;

/**
 *
 * @author sun
 */
public abstract class DataPrivilegeControl extends EntityManagerHolder{
    private static String[] excludes=null;
    static{
        excludes=PropertyHolder.getProperty("data.privilege.control.exclude").split(",");
    }
    
    public DataPrivilegeControl(){
        super(MultiDatabase.APDPlat);
    }
    public DataPrivilegeControl(MultiDatabase multiDatabase){
        super(multiDatabase);
    }

    protected boolean needPrivilege(String modelClass){
        for(String exclude : excludes){
            if(exclude.equals(modelClass)){
                return false;
            }
        }
        return true;
    }
    protected <T extends Model> boolean needPrivilege(Class<T> modelClass){
        String entity=getEntityName(modelClass);
        return needPrivilege(entity);
    }

    /**
     * 获取实体的名称
     * @param clazz
     * @return
     */
    protected String getEntityName(Class<? extends Model> clazz) {
        String entityname = clazz.getSimpleName();

        Entity entity = clazz.getAnnotation(Entity.class);
        if (entity != null && entity.name() != null && !"".equals(entity.name())) {
            entityname = entity.name();
        }
        return entityname;
    }
}