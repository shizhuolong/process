package org.apdplat.module.dictionary.model;

import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
import org.apdplat.platform.generator.ActionGenerator;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;
import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.model.SimpleModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
/**
 *数据字典项
 * @author sun
 */
@Entity
@Scope("prototype")
@Component
@XmlType(name = "DicItem")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE) 
@Table(name="APDP_DICITEM")
@Database
public class DicItem extends SimpleModel {

    @ManyToOne
    @ModelAttr("数据字典")
    @ModelAttrRef("chinese")
    protected Dic dic;
    @ModelAttr("编码")
    protected String code;
    @ModelAttr("名称")
    protected String name;
    @ModelAttr("排序号")
    protected int orderNum;

    @XmlAttribute
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @XmlAttribute
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @XmlAttribute
    public int getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(int orderNum) {
        this.orderNum = orderNum;
    }

    @XmlTransient
    public Dic getDic() {
        return dic;
    }

    public void setDic(Dic dic) {
        this.dic = dic;
    }
    @Override
    public String getMetaData() {
        return "数据字典项";
    }
    public static void main(String[] args){
        DicItem obj=new DicItem();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}