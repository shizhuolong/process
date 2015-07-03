package org.apdplat.module.info.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.generator.ActionGenerator;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@Table(name="APDP_NEWSCONTENT")
@Database
public class NewsContent extends SimpleModel{
    @ManyToOne
    @ModelAttr("新闻")
    protected News news;
    
    @Enumerated(EnumType.STRING) 
    protected Lang lang;
    
    @ModelAttr("标题")
    protected String title;
    @Lob
    @ModelAttr("内容")
    protected String content;

    public News getNews() {
        return news;
    }

    public void setNews(News news) {
        this.news = news;
    }    

    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    
    @Override
    public String getMetaData() {
        return "新闻多语言内容";
    }
    public static void main(String[] args){
        NewsContent obj=new NewsContent();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}