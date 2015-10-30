package org.apdplat.module.module.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apdplat.module.module.model.AppModule;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.service.ServiceFacade;
import org.springframework.stereotype.Service;
/**
 * 模块服务
 * @author sun
 */
@Service
public class AppModuleService {
    protected static final APDPlatLogger LOG = new APDPlatLogger(AppModuleService.class);
    @Resource(name = "serviceFacade")
    private ServiceFacade serviceFacade;

    public AppModule getRootModule() {
        PropertyEditor propertyEditor = new PropertyEditor("english", Operator.eq, "root");

        PropertyCriteria propertyCriteria = new PropertyCriteria();
        propertyCriteria.addPropertyEditor(propertyEditor);

        List<AppModule> roots = serviceFacade.query(AppModule.class, null, propertyCriteria).getModels();
        if(roots!=null && roots.size()>0){
            return roots.get(0);
        }
        LOG.error("有多个根模块!");
        return null;
    }

    public AppModule getModule(String english) {
        PropertyEditor propertyEditor = new PropertyEditor("english", Operator.eq, english);

        PropertyCriteria propertyCriteria = new PropertyCriteria();
        propertyCriteria.addPropertyEditor(propertyEditor);

        List<AppModule> page = serviceFacade.query(AppModule.class, null, propertyCriteria).getModels();
        if (page.isEmpty()) {
            return null;
        }
        return page.get(0);
    }

    public AppModule getModule(long id) {
        PropertyEditor propertyEditor = new PropertyEditor("id", Operator.eq, Long.toString(id));

        PropertyCriteria propertyCriteria = new PropertyCriteria();
        propertyCriteria.addPropertyEditor(propertyEditor);

        List<AppModule> page = serviceFacade.query(AppModule.class, null, propertyCriteria).getModels();
        if (page.isEmpty()) {
            LOG.error("没有找到ID等于" + id + "的模块");
            return null;
        }
        return page.get(0);
    }

    public String toJson(AppModule module,boolean recursion) {
        StringBuilder json = new StringBuilder();
        List<AppModule> subModules=new ArrayList<>();
        if(module==null){
        	module = getRootModule();
        	subModules.add(module);
        }else{
        	subModules=module.getSubModules();
        }
        if (subModules.size() > 0) {
            json.append("[");
            for (AppModule m : subModules) {
                json.append("{\"text\":\"").append(m.getChinese()).append("\",\"id\":\"module-").append(m.getId()).append("\",\"iconCls\":\"").append(m.getEnglish()).append("\"");
                if (m.getSubModules().size()>0 && recursion) {
                    json.append(",children:").append(toJson(m,recursion));
                }
                if (m.getSubModules().size() > 0) {
                    json.append(",\"leaf\":false");
                } else {
                	json.append(",\"leaf\":true");
                }
                json.append("},");
            }
            json = json.deleteCharAt(json.length() - 1);
            json.append("]");
        }
        return json.toString();
    }
}