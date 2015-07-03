package org.apdplat.module.info.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
import org.apdplat.platform.annotation.RenderIgnore;
import org.apdplat.platform.generator.ActionGenerator;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@Table(name="APDP_NEWS")
@Database
public class News extends SimpleModel{
    @Transient
    @ModelAttr("语言")
    protected String lang="zh";
    
    @ManyToOne
    @RenderIgnore
    @ModelAttr("类型")
    @ModelAttrRef("infoTypeName")
    protected InfoType infoType;
    
    @ModelAttr("是否可用")
    protected boolean enabled=true;
    
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "news")
    @RenderIgnore
    @ModelAttr("多语言内容")
    protected List<NewsContent> newsContents=new ArrayList<>();
    
    public void forceSpecifyLanguageForCreate(String language){
        if(newsContents.size()==1 && id==null){
            newsContents.get(0).setLang(Lang.valueOf(language));
        }        
    }
    
    public String getTitle(){
        for(NewsContent newsContent : newsContents){
            if(newsContent.getLang().getSymbol().equals(lang)){
                return newsContent.getTitle();
            }
        }
        return null;
    }
    //setTitle方法依赖于setLang方法先执行
    public void setTitle(String title){
        LOG.info("设置标题");
        LOG.info("模型语言："+lang);
        NewsContent newsContent = getNewsContent();
        newsContent.setTitle(title);
    }
    
    public String getContent(){
        for(NewsContent newsContent : newsContents){
            if(newsContent.getLang().getSymbol().equals(lang)){
                return newsContent.getContent();
            }
        }
        return null;
    }
    //setContent方法依赖于setLang方法先执行
    public void setContent(String content){
        LOG.info("设置内容");
        LOG.info("模型语言："+lang);
        NewsContent newsContent = getNewsContent();
        newsContent.setContent(content);
    }
    private NewsContent getNewsContent(){
        for(NewsContent newsContent : newsContents){
            if(newsContent.getLang().getSymbol().equals(lang)){
                return newsContent;
            }
        }
        NewsContent newsContent = new NewsContent();
        newsContent.setLang(Lang.valueOf(lang));
        newsContent.setNews(this);
        newsContents.add(newsContent);
        return newsContent;
    }
    
    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
    public InfoType getInfoType() {
        return infoType;
    }

    public void setInfoType(InfoType infoType) {
        this.infoType = infoType;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }    

    public void addNewsContent(NewsContent newsContent) {
        this.newsContents.add(newsContent);
    }

    public void removeNewsContent(NewsContent newsContent) {
        this.newsContents.remove(newsContent);
    }

    public void clear(){
        this.newsContents.clear();
    }
    
    @Override
    public String getMetaData() {
        return "新闻";
    }
    public static void main(String[] args){
        News obj=new News();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}