package org.apdplat.module.module.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

import org.apache.struts2.ServletActionContext;
import org.apdplat.module.module.service.ModuleService;
import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
import org.apdplat.platform.model.SimpleModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
/**
 *App模块对象
 * @author sun
 */
@Entity
@Scope("prototype")
@Component
@XmlRootElement
@XmlType(name = "Module")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE) 
@Table(name="APDP_APP_MODULE")
@Database
public class AppModule extends SimpleModel {

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "parentModule")
    @OrderBy("orderNum ASC")
    //不缓存，如果缓存则在修改排序号之后数据不会失效
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE) 
    protected List<AppModule> subModules = new ArrayList<>();
    @ManyToOne
    @ModelAttr("父模块")
    @ModelAttrRef("chinese")
    protected AppModule parentModule;
    @ModelAttr("模块英文名称")
    protected String english;
    @ModelAttr("模块中文名称")
    protected String chinese;
    @ModelAttr("排序号")
    protected int orderNum;
    @ModelAttr("是否显示")
    protected boolean display=true;
    @ModelAttr("链接地址")
    protected String url;

    @XmlElementWrapper(name = "subModules")
    @XmlElement(name = "module")
    public List<AppModule> getSubModules() {
        return subModules;
    }

    public void addSubModule(AppModule subModule) {
        this.subModules.add(subModule);
    }

    public void removeSubModule(AppModule subModule) {
        this.subModules.remove(subModule);
    }
    
    @XmlAttribute
    public String getUrl() {
    	return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    @XmlTransient
    public AppModule getParentModule() {
        return parentModule;
    }

    public void setParentModule(AppModule parentModule) {
        this.parentModule = parentModule;
    }
    
    @XmlAttribute
    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    @XmlAttribute
    public String getChinese() {
        return chinese;
    }

    public void setChinese(String chinese) {
        this.chinese = chinese;
    }

    @XmlAttribute
    public int getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(int orderNum) {
        this.orderNum = orderNum;
    }

    @XmlAttribute
    public boolean isDisplay() {
        return display;
    }

    public void setDisplay(boolean display) {
        this.display = display;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final AppModule other = (AppModule) obj;
        if ((this.chinese == null) ? (other.chinese != null) : !this.chinese.equals(other.chinese)) {
            return false;
        }
        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 97 * hash + (this.english != null ? this.english.hashCode() : 0);
        return hash;
    }

    @Override
    public String getMetaData() {
        return "模块信息";
    }
}