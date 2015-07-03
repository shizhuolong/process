package org.apdplat.module.module.model;

import org.apdplat.module.module.service.ModuleService;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
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
 *命令对象
 * @author sun
 */
@Entity
@Scope("prototype")
@Component
@XmlType(name = "Command")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE) 
@Table(name="APDP_COMMAND")
@Database
public class Command extends SimpleModel {

    @ManyToOne
    @ModelAttr("所属模块")
    @ModelAttrRef("chinese")
    protected Module module;
    @ModelAttr("命令英文名称")
    protected String english;
    @ModelAttr("命令中文名称")
    protected String chinese;
    @ModelAttr("链接地址")
    protected String url;
    @ModelAttr("专属用户名")
    protected String username;
    @ModelAttr("排序号")
    protected int orderNum;
    @ModelAttr("是否显示")
    protected boolean display=true;

    @XmlTransient
    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
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
    public String getUrl() {
        String result="";
        if(url==null){
            result="../platform/"+ ModuleService.getModulePath(this.getModule())+this.getEnglish()+".jsp";
        }else{
            result=url;
        }
        return result;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @XmlAttribute
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlAttribute
    public boolean isDisplay() {
        return display;
    }

    public void setDisplay(boolean display) {
        this.display = display;
    }

    @Override
    public String getMetaData() {
        return "命令信息";
    }
}