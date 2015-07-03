package org.apdplat.wgreport.common;

import org.apdplat.wgreport.detail.DetailDownload;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.UpdateSupport;
import org.apdplat.wgreport.support.servlets.SpringServlet;



public abstract class SpringManager {
	public final static String findDao = "sqlSupport";
	public final static String arrayFindDao = "arraySqlSupport";
	public final static String updateDao = "sqlSupport";
	public final static String excelComponent = "excelComponent";

	public static FindSupport getFindDao() {
		return (FindSupport) SpringServlet.getBean(findDao);
	}

	public static FindSupport getArrayFindDao() {
		return (FindSupport) SpringServlet.getBean(arrayFindDao);
	}

	public static UpdateSupport getUpdateDao() {
		return (UpdateSupport) SpringServlet.getBean(updateDao);
	}
	
	public static DetailDownload getDetailDownload() {
		return (DetailDownload) SpringServlet.getBean(excelComponent);
	}
}
