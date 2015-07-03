package org.apdplat.platform.action;

import org.apdplat.platform.model.Model;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
/**
 *
 *
 * @author sun
 */
@Controller
@Scope("prototype")
@Namespace("/web")
public class FacadeAction extends SimpleAction<Model> implements Action {
}