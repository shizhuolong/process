package org.apdplat.module.module.action;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.module.module.service.ModuleService;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.util.Struts2Utils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
/**
* 维护树形模块，对应于module.xml文件
 * 在module.xml中的数据未导入到数据库之前，可以通过修改module.xml文件的形式修改树形模块
 * 在module.xml中的数据导入到数据库之后，就只能在浏览器网页中对树形模块进行修改
 *
 * 修改模块
* @author sun
*/
@Controller
@Scope("prototype")
@Namespace("/module")
public class EditModuleAction extends ExtJSSimpleAction<Module> {
        @Resource(name="moduleService")
        private ModuleService moduleService;
        private String node;
        @Override
        public String query(){
            if(node==null){
                return super.query();
            }
            if(node.trim().startsWith("root")){
                String json=moduleService.toRootJsonForEdit();
                Struts2Utils.renderJson(json);
                return null;
            }
            
            if(node.contains("-")){
                try{
                    String[] temp=node.split("-");
                    long id=Long.parseLong(temp[1]);
                    Module module=moduleService.getModule(id);
                    String json=moduleService.toJsonForEdit(module);
                    Struts2Utils.renderJson(json);
                }catch(Exception e){
                    LOG.error("获取根模块出错",e);
                }
            }
            
            return null;
        }
        
        @Override
        protected void assemblyModelForCreate(Module model) {
        	String path = ServletActionContext.getRequest().getContextPath();
            String result = path+"/";
        	/**默认为每个新增的菜单添加一个查询(query)的command，用户在界面分配权限。**/
        	if(null!=model.getUrl() && !result.equals(model.getUrl())) {
        		Command command = new Command();
        		command.setChinese("查询");
        		command.setEnglish("query");
        		command.setVersion(0);
        		command.setOrderNum(1);
        		command.setModule(model);
        		
        		model.addCommand(command);
        	}
        }
        

        public void setNode(String node) {
            this.node = node;
        }
}