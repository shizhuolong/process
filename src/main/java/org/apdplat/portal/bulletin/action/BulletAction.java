package org.apdplat.portal.bulletin.action;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.bulletin.service.BulletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 社会渠道编辑
 * @author szl
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class BulletAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private BulletService service;
		
	public void update() {
		try {
			double is_jf=Double.parseDouble(request.getParameter("is_jf"));
			String hq_code=request.getParameter("hq_code");
			String month=request.getParameter("month");
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("is_jf",is_jf);
			m.put("hq_code",hq_code);
			m.put("month",month);
			service.update(m);
			this.reponseJson("修改成功");
		} catch (Exception e) {
			this.reponseJson("修改失败");
		}
	}
	
}
