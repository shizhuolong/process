package org.apdplat.module.info.service;

import org.apdplat.module.info.model.InfoType;
import org.apdplat.module.info.model.InfoTypeContent;
import org.apdplat.platform.criteria.Criteria;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.service.ServiceFacade;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 *
 * @author sun
 */
@Service
public class InfoTypeService {
    protected static final APDPlatLogger LOG = new APDPlatLogger(InfoTypeService.class);

    public static List<Long> getChildIds(InfoType obj) {
        List<Long> ids=new ArrayList<>();
        List<InfoType> child=obj.getChild();
        for(InfoType item : child){
            ids.add(item.getId());
            ids.addAll(getChildIds(item));
        }
        return ids;
    }
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;

    
    public String toRootJson(String lang){
        InfoType infoType=getRootInfoType();
        infoType.setLang(lang);
        
        if(infoType==null){
            LOG.error("获取根新闻类别失败！");
            return "";
        }
        StringBuilder json=new StringBuilder();
        json.append("[");

        json.append("{'text':'")
            .append(infoType.getInfoTypeName())
            .append("','id':'")
            .append(infoType.getId());
            if(infoType.getChild().isEmpty()){
                json.append("','leaf':true,'cls':'file'");
            }else{
                json.append("','leaf':false,'cls':'folder'");
            }
        json.append("}");
        json.append("]");
        
        return json.toString();
    }
    public String toJson(long infoTypeId, String lang){
        InfoType infoType=serviceFacade.retrieve(InfoType.class, infoTypeId);
        if(infoType==null){
            LOG.error("获取ID为 "+infoType+" 的新闻类别失败！");
            return "";
        }
        List<InfoType> child=infoType.getChild();
        if(child.isEmpty()){
            return "";
        }
        StringBuilder json=new StringBuilder();
        json.append("[");

        
        for(InfoType item : child){
            item.setLang(lang);
            json.append("{'text':'")
                .append(item.getInfoTypeName())
                .append("','id':'")
                .append(item.getId());
                if(item.getChild().isEmpty()){
                    json.append("','leaf':true,'cls':'file'");
                }else{
                    json.append("','leaf':false,'cls':'folder'");
                }
           json .append("},");
        }
        //删除最后一个,号，添加一个]号
        json=json.deleteCharAt(json.length()-1);
        json.append("]");

        return json.toString();
    }
    public InfoType getRootInfoType(){
        try{
            PropertyCriteria propertyCriteria = new PropertyCriteria(Criteria.or);
            propertyCriteria.addPropertyEditor(new PropertyEditor("infoTypeName", Operator.eq, "String","新闻类别"));
            Page<InfoTypeContent> page = serviceFacade.query(InfoTypeContent.class, null, propertyCriteria);
            if (page.getTotalRecords() == 1) {
                return page.getModels().get(0).getInfoType();
            }
        }catch(Exception e){
            LOG.error("获取ROOT失败",e);
        }
        return null;
    }
}