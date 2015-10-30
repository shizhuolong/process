package org.apdplat.module.module.action;

import javax.annotation.Resource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.module.model.AppModule;
import org.apdplat.module.module.service.AppModuleService;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.util.Struts2Utils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
/**
* App为树形模块导航菜单服务
* @author sun
*/
@Controller
@Scope("prototype")
@Namespace("/module")
public class AppModuleAction extends ExtJSSimpleAction<AppModule> {
        @Resource(name="appModuleService")
        private AppModuleService moduleService;
       
        private String node;
        private boolean recursion=false;
        public boolean isRecursion() {
			return recursion;
		}
		public void setRecursion(boolean recursion) {
			this.recursion = recursion;
		}
		@Override
		public String query() {
			if (node == null) {
				return super.query();
			}
	
			AppModule module = null;
			if (node.contains("-")) {
				String[] temp = node.split("-");
				long id = Long.parseLong(temp[1]);
				module = moduleService.getModule(id);
			} else if (node.trim().startsWith("root")) {
				module = moduleService.getRootModule();
			}
			String json = moduleService.toJson(module,recursion);
			Struts2Utils.renderJson(json);
	
			return null;
		}
        public void setNode(String node) {
            this.node = node;
        }
}