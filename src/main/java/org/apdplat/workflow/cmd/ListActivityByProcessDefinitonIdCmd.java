package org.apdplat.workflow.cmd;

/**  
 * @author : suyi
 * @date 2014-4-2 上午09:44:24
 * @version V1.0  
 */

import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.apdplat.platform.log.APDPlatLogger;

public class ListActivityByProcessDefinitonIdCmd implements Command<Map<String, String>> {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
    private String processDefinitionId;

    public ListActivityByProcessDefinitonIdCmd(String processDefinitionId) {
        this.processDefinitionId = processDefinitionId;
    }

    public Map<String, String> execute(CommandContext commandContext) {
        ProcessDefinitionEntity processDefinition = Context.getCommandContext().getProcessDefinitionEntityManager()
        	.findProcessDefinitionById(processDefinitionId);
        Map<String, String> map = new HashMap<String, String>();
        for (ActivityImpl activity : processDefinition.getActivities()) {
            logger.info("{}", activity.getProperties());

            if ("userTask".equals(activity.getProperty("type"))) {
                map.put(activity.getId(), (String) activity.getProperty("name"));
            }
        }
        return map;
    }
}

