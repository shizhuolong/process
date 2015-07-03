package org.apdplat.module.security.service;

import org.apdplat.module.security.model.Org;
import org.apdplat.platform.criteria.Criteria;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.criteria.PropertyType;
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
public class OrgService {
    protected static final APDPlatLogger LOG = new APDPlatLogger(OrgService.class);
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;

    public static List<String> getChildNames(Org org){
        List<String> names=new ArrayList<>();
        List<Org> child=org.getChild();
        for(Org item : child){
            names.add(item.getOrgName());
            names.addAll(getChildNames(item));
        }
        return names;
    }
    public static List<Long> getChildIds(Org org){
        List<Long> ids=new ArrayList<>();
        List<Org> child=org.getChild();
        for(Org item : child){
            ids.add(item.getId());
            ids.addAll(getChildIds(item));
        }
        return ids;
    }
    public static boolean isParentOf(Org parent,Org child){
        Org org=child.getParent();
        while(org!=null){
            if(org.getId()==parent.getId()){
                return true;
            }
            org=org.getParent();
        }
        return false;
    }
    
    public String toRootJson(String treeId){
        Org rootOrg=getRootOrg(treeId);
        if(rootOrg==null){
            LOG.error("获取根组织架构失败！");
            return "";
        }
        StringBuilder json=new StringBuilder();
        json.append("[");

        json.append("{'text':'")
            .append(rootOrg.getOrgName())
            .append("','id':'")
            .append(rootOrg.getId());
            if(rootOrg.getChild().isEmpty()){
                json.append("','leaf':true,'cls':'file'");
            }else{
                json.append("','leaf':false,'cls':'folder'");
            }
        json.append("}");
        json.append("]");
        
        return json.toString();
    }
    public String toJson(long orgId){
        Org org=serviceFacade.retrieve(Org.class, orgId);
        if(org==null){
            LOG.error("获取ID为 "+orgId+" 的组织架构失败！");
            return "";
        }
        List<Org> child=org.getChild();
        if(child.isEmpty()){
            return "";
        }
        StringBuilder json=new StringBuilder();
        json.append("[");

        
        for(Org item : child){
            json.append("{'text':'")
                .append(item.getOrgName())
                .append("','id':'")
                .append(item.getId());
                /*if(item.getChild().isEmpty()){
                    json.append("','leaf':true,'cls':'file'");
                }else{
                    json.append("','leaf':false,'cls':'folder'");
                }*/
                json.append("','leaf':false,'cls':'folder'");
           json .append("},");
        }
        //删除最后一个,号，添加一个]号
        json=json.deleteCharAt(json.length()-1);
        json.append("]");

        return json.toString();
    }
    public Org getRootOrg(String treeId){
    	long orgId = UserHolder.getCurrentLoginUser().getOrg().getId();
        PropertyCriteria propertyCriteria = new PropertyCriteria(Criteria.and);
        //propertyCriteria.addPropertyEditor(new PropertyEditor("orgName", Operator.eq, "String","组织架构"));
        propertyCriteria.addPropertyEditor(new PropertyEditor("id", Operator.eq, PropertyType.Integer,orgId));
        propertyCriteria.addPropertyEditor(new PropertyEditor("treeId", Operator.eq, "String",treeId));
        Page<Org> page = serviceFacade.query(Org.class, null, propertyCriteria); 
        if (page.getTotalRecords() == 1) {
            return page.getModels().get(0);
        }
        return null;
    }
}