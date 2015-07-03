
<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<chart width="100" height="100">
  <!-- <message bg_color="#BBBB00" text_color="#FFFFFF"><![CDATA[You can broadcast any message to chart from data XML file]]></message> -->
	<series>
		<s:iterator value="list" status="status">
			<!--<value xid="<s:property value="#status.index"/>">${name}</value>-->
			<value xid="${status.index}">${GROUPNAME}</value>
		</s:iterator>
	</series>
	<graphs>
		<graph gid="1">
			<s:iterator value="list" status="status">
				<value xid="${status.index}" color="#318DBD">${DAY_2G}</value>
			</s:iterator>
		</graph>
		<graph gid="2">
			<s:iterator value="list" status="status">
				<value xid="${status.index}">${DAY_3G}</value>
			</s:iterator>
		</graph>
	</graphs>
	<!-- 
	<guides>	                                   
		<guide>                      
			<s:iterator value="list" status="status">
				<s:if test="#status.index==0">
					<title>${title}</title>
				</s:if>
			</s:iterator>                
			<color>#00CC00</color>                             
			<inside>true</inside>  
		</guide>  
	</guides>
	 -->
</chart>
