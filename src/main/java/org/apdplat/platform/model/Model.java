package org.apdplat.platform.model;

import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.RenderIgnore;
import org.apdplat.platform.annotation.SimpleDic;
import org.apdplat.platform.annotation.TreeDic;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ReflectionUtils;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.xml.bind.annotation.XmlTransient;
import org.apdplat.platform.annotation.ModelAttrRef;

/**
 *
 * 所有领域对象的基类
 * 在映射的时候，如果类名或字段名与数据库的关键词冲突，则在类名后面加Table,在字段名后面加Field
 *
 * @author sun
 */
@MappedSuperclass
@EntityListeners(value = ModelListener.class)
public abstract class Model implements Serializable{
    @Transient
    @RenderIgnore
    private static final long serialVersionUID = 1L;

    @Transient
    @RenderIgnore
    protected final APDPlatLogger LOG = new APDPlatLogger(getClass());
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ModelAttr("编号")
    protected Long id;
    @Column(updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("创建时间")
    protected Date createTime;
    @Column(insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("上一次更新时间")
    protected Date updateTime;
    @Version
    @ModelAttr("更新次数")
    protected Integer version;
    
    public Model(){
        //ModelMetaData.addMetaData(this);
    }

        
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @XmlTransient
    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Model)) {
            return false;
        }
        Model model = (Model) obj;
        return model.getId() == this.getId();
    }

    @Override
    public int hashCode() {
        if (id == null) {
            id = -1L;
        }
        return new Long(id + 1000).hashCode();
    }

    @Override
    public String toString() {
        return this.getMetaData() + this.getId();
    }
    public List<ModelFieldData> getAllRenderModelAttr(){
        List<ModelFieldData> list=new ArrayList<>();
        //获取所有字段，包括继承的
        List<Field> fields = ReflectionUtils.getDeclaredFields(this);
        for (Field field : fields) {
            if(field.isAnnotationPresent(RenderIgnore.class)){
                continue;
            }
            ModelFieldData data=getFieldData(field);
            if(data!=null){
                list.add(data);
            }
        }
        return list;
    }
    public List<ModelFieldData> getAllModelAttr(){
        List<ModelFieldData> list=new ArrayList<>();
        //获取所有字段，包括继承的
        List<Field> fields = ReflectionUtils.getDeclaredFields(this);
        for (Field field : fields) {
            ModelFieldData data=getFieldData(field);
            if(data!=null){
                list.add(data);
            }
        }
        return list;
    }
    public List<ModelFieldData> getModelAttr(){
        List<ModelFieldData> list=new ArrayList<>();
        //获取所有字段，不包括继承的
        Field[] fields = this.getClass().getDeclaredFields();
        for (Field field : fields) {
            ModelFieldData data=getFieldData(field);
            if(data!=null){
                list.add(data);
            }
        }
        return list;
    }
    private ModelFieldData getFieldData(Field field){
        if(field.isAnnotationPresent(ModelAttr.class)){
            String english=field.getName();
            return getModelFieldData(english,field);
        }
        return null;
    }
    private ModelFieldData getModelFieldData(String english, Field field){
        String chinese=field.getAnnotation(ModelAttr.class).value();
        ModelFieldData data=new ModelFieldData();
        data.setChinese(chinese);
        data.setEnglish(english);
        data.setSimpleDic("");
        data.setTreeDic("");
        data.setManyToOneRef("");
        if(field.isAnnotationPresent(SimpleDic.class)){
            String dic=field.getAnnotation(SimpleDic.class).value();
            data.setSimpleDic(dic);
        }
        if(field.isAnnotationPresent(TreeDic.class)){
            String dic=field.getAnnotation(TreeDic.class).value();
            data.setTreeDic(dic);
        }
        if(field.isAnnotationPresent(ManyToOne.class)){
            data.setManyToOne(true);
            if(field.isAnnotationPresent(ModelAttrRef.class)){
                String manyToOneRef=field.getAnnotation(ModelAttrRef.class).value();
                data.setManyToOneRef(manyToOneRef);
            }
        }
        String valueClass=field.getType().getSimpleName();
        if("Timestamp".equals(valueClass) || "Date".equals(valueClass)){
            data.setType("Date");
        }else{
            data.setType(valueClass);
        }
        return data;
    }
    public abstract String getMetaData();
}