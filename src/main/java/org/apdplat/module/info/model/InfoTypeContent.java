package org.apdplat.module.info.model;

import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.generator.ActionGenerator;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;
import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@XmlType(name = "InfoTypeContent")
@Table(name="APDP_INFOTYPECONTENT")
@Database
public class InfoTypeContent extends SimpleModel{
    @ManyToOne
    @ModelAttr("新闻类别")
    protected InfoType infoType;    
    @ModelAttr("多国语言")
    @Enumerated(EnumType.STRING) 
    protected Lang lang;
    
    @ModelAttr("类别名称")
    protected String infoTypeName;


    @XmlAttribute
    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }

    @XmlTransient
    public InfoType getInfoType() {
        return infoType;
    }

    public void setInfoType(InfoType infoType) {
        this.infoType = infoType;
    }

    @XmlAttribute
    public String getInfoTypeName() {
        return infoTypeName;
    }

    public void setInfoTypeName(String infoTypeName) {
        this.infoTypeName = infoTypeName;
    }


    
    @Override
    public String getMetaData() {
        return "新闻类别多语言内容";
    }
    public static void main(String[] args){
        InfoTypeContent obj=new InfoTypeContent();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}