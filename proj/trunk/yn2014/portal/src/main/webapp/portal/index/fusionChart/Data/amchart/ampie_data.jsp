
<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<pie>
	<s:iterator value="list" status="status">
		<slice title="${x}">${y}</slice>
	</s:iterator>
</pie>
