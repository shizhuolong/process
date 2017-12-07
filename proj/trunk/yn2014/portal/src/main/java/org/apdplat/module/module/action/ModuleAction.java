package org.apdplat.module.module.action;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.manager.bean.TreeJson;
import org.apdplat.manager.dao.ItemSetDao;
import org.apdplat.module.module.model.Module;
import org.apdplat.module.module.service.ModuleService;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.Struts2Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
/**
* 为树形模块导航菜单服务
* @author sun
*/
@Controller
@Scope("prototype")
@Namespace("/module")
public class ModuleAction extends ExtJSSimpleAction<Module> {
        @Resource(name="moduleService")
        private ModuleService moduleService;
        @Autowired
        private ServiceFacade serviceFacade;
        @Autowired
    	private ItemSetDao dao;
        
        private String node;
        private boolean privilege=false;
        private boolean recursion=false;      
        @Override
        public String query(){
            if(node==null){
                return super.query();
            }
            //手动缓存控制
            /*String key="node:"+node+"_privilege:"+privilege+"_recursion:"+recursion;
            //如果privilege=ture，所有用户共享一份数据
            if(!privilege){
                key=UserHolder.getCurrentLoginUser().getUsername()+"_"+key;
            }
            String value=ModuleCache.get(key);
            if(value!=null){
                LOG.info("使用缓存数据，key:"+key);
                LOG.debug("使用缓存数据，value:"+value);
                Struts2Utils.renderJson(value);
                return null;
            }*/
            
           /* long start=System.currentTimeMillis();
            Module module=null;
            if(node.contains("-")){
                String[] temp=node.split("-");
                long id=Long.parseLong(temp[1]);
                module=moduleService.getModule(id);
            }else if(node.trim().startsWith("root")){
                module=moduleService.getRootModule();
            }
            if(module!=null){
                String json="";
                if(privilege){
                    json=moduleService.toJsonForPrivilege(module);
                }else{
                    json=moduleService.toJsonForUser(module,recursion);
                }
                
                LOG.info("module.query cost:"+(System.currentTimeMillis()-start));
               // LOG.info("设置缓存数据，key:"+key);
               //ModuleCache.put(key, json);
                Struts2Utils.renderJson(json);
            }*/
            
            if(privilege) {
            	 Module module=null;
                 if(node.contains("-")){
                     String[] temp=node.split("-");
                     long id=Long.parseLong(temp[1]);
                     module=moduleService.getModule(id);
                     String json=moduleService.toJsonForPrivilege(module);
                     Struts2Utils.renderJson(json);
                 }else if(node.trim().startsWith("root")){
                     //module=moduleService.getRootModule();
                     List<TreeJson> allMenu=dao.listMenuData();
                	 for(TreeJson t:allMenu){
                		 if(t.getType().equals("0")){
                			 t.setId("module-"+t.getId());
                		 }else{
                			 t.setId("command-"+t.getId());
                		 }
     	    			t.setPid("module-"+t.getPid());
     	    		}
     	    		String l=TreeJson.createTreeJson(allMenu);
     	    		Struts2Utils.renderJson(l);
                 }
            }else {
	            User user = UserHolder.getCurrentLoginUser();
	            String path = ServletActionContext.getRequest().getContextPath();
	            long userId = user.getId();
	            boolean isSuperManager = user.isSuperManager();  //是否为超级管理员
	            StringBuilder sb = new StringBuilder();
	            if(isSuperManager) {
	            	sb.append("select id,chinese,english,url from apdp_module where display=1 and parentmodule_id=? order by ordernum");
	            }else {
	            	sb.append("select * from (select id,chinese,english,url,ordernum  from apdp_module t where display=1 and parentmodule_id=? and id in (select distinct t.id from apdp_module t ")
	            	.append("connect by prior t.parentmodule_id= t.id start with t.id in (select c.module_id from apdp_user_role a ")
	            	.append("inner join apdp_role_command b on a.roleid=b.roleid inner join apdp_command c on b.commandid=c.id where a.userid=?)) ")
	            	.append("union select id,chinese,english,url,ordernum from apdp_module t where display=1 and parentmodule_id=? and id in (select distinct t.id from apdp_module t ")
	            	.append("connect by prior t.parentmodule_id= t.id start with t.id in (select c.module_id from apdp_role a inner join ")
	            	.append("apdp_role_command b on a.id=b.roleid inner join apdp_command c on b.commandid=c.id where a.id in ")
	            	.append("(select a.roleid from apdp_usergroup_role a inner join apdp_user_usergroup b on a.usergroupid=b.usergroupid ")
	            	.append("where b.userid=?)))) order by ordernum");
	            }
	            long start=System.currentTimeMillis();
	            Module module=null;
	            if(node.contains("-")){
	                String[] temp=node.split("-");
	                long id=Long.parseLong(temp[1]);
	                Long paras[] = null;
	                if(isSuperManager) {
	                	paras = new Long[]{id};
	                }else {
	                	paras = new Long[]{id,userId,id,userId};
	                }
	                List<Map> list = serviceFacade.queryForMap(sb.toString(), paras);
	                StringBuilder json = new StringBuilder();
	                json.append("[");
	                Map map = null;
	                for(int i=0,len=list.size();i<len;i++) {
	                	map = list.get(i);
	                	json.append("{\"text\":\"").append(map.get("CHINESE")).append("\",\"id\":\"module-").append(map.get("ID")).append("\",\"iconCls\":\"").append(map.get("ENGLISH")).append("\"");
	                	if(StringUtils.isBlank(map.get("URL")+"") || "null".equals(map.get("URL")+"")){
	                		json.append(",\"leaf\":false");
	                	}else {
	                		json.append(",\"leaf\":true");
	                		json.append(",listeners:{\"click\":function(node,event){openTab(node,event,\"").append(path+"/"+map.get("URL")+"").append("\")}}");
	                	}
	                	json.append("},");
	                }
	                json = json.deleteCharAt(json.length() - 1);
	                json.append("]");
	                LOG.info("module.query cost:"+(System.currentTimeMillis()-start));
	                Struts2Utils.renderJson(json.toString());
	            }else if(node.trim().startsWith("root")){
	                module=moduleService.getRootModule();
	                String json=moduleService.toJsonForUser(module,recursion);
	                LOG.info("module.query cost:"+(System.currentTimeMillis()-start));
	                Struts2Utils.renderJson(json);
	            }
            }
            return null;
        }

        public void setRecursion(boolean recursion) {
            this.recursion = recursion;
        }

        public void setPrivilege(boolean privilege) {
            this.privilege = privilege;
        }

        public void setNode(String node) {
            this.node = node;
        }
}