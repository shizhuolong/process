package org.apdplat.platform.model;

import org.apdplat.platform.annotation.ModelAttr;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import org.apdplat.module.security.model.User;
import org.apdplat.platform.annotation.ModelAttrRef;

/**
 *
 * 继承这个类的模型必须和User模型存放在同一个数据库中
 * 
 * @author sun
 */
@MappedSuperclass
public abstract class SimpleModel extends Model{
    @ManyToOne
    @ModelAttr("数据所有者名称")
    @ModelAttrRef("username")
    protected User ownerUser;
    
    public User getOwnerUser() {
        return ownerUser;
    }

    public void setOwnerUser(User ownerUser) {
        if(this.ownerUser==null){
            this.ownerUser = ownerUser;
        }else{
            LOG.info("忽略设置OwnerUser");
        }
    }
}