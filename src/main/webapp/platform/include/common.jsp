<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
String contextPath=org.apdplat.module.system.service.SystemListener.getContextPath();
String jsessionid=session.getId();
%>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/extjs/css/ext-all.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/extjs/css/ext-patch.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/extjs/ux/css/CheckTreePanel.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/extjs/ux/css/ux-all.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/platform/css/operation.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/platform/css/module.css"/>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/platform/theme/style/index.css">

<script type="text/javascript" src="<%=contextPath%>/extjs/js/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=contextPath%>/extjs/js/ext-all.js"></script>
<script type="text/javascript" src="<%=contextPath%>/extjs/js/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=contextPath%>/extjs/js/ext-basex.js"></script>
<script type="text/javascript" src="<%=contextPath%>/extjs/ux/Toast.js"></script>
<script type="text/javascript" src="<%=contextPath%>/extjs/ux/CheckTreePanel.js"></script>
<script type="text/javascript">  
    if(this.parent!=this){
              parent.openingWindows.push(this);
    }
    function refreshTheme(){
              var storeTheme=Ext.util.Cookies.get('theme');
              if(storeTheme==null || storeTheme==''){
                      storeTheme='ext-all';
              }
              Ext.util.CSS.swapStyleSheet("theme", contextPath+"/extjs/css/"+storeTheme+".css");  
    }
    var contextPath='<%=contextPath%>';
    var jsessionid='<%=jsessionid%>';
    Ext.BLANK_IMAGE_URL = contextPath+'/extjs/images/default/s.gif';
    refreshTheme();
</script>

<script type="text/javascript" src="<%=contextPath%>/platform/js/dic.js"></script>
<script type="text/javascript" src="<%=contextPath%>/platform/js/map.js"></script>
<script type="text/javascript" src="<%=contextPath%>/platform/js/APDPlat.js"></script>
<!-- 分页扩展组件 -->
<script type="text/javascript" src="<%=contextPath%>/platform/js/PageSizePlugin.js"></script>
<!--session 超时检测重新登录 -->
<script type="text/javascript" src="<%=contextPath%>/js/reLogin.js"></script>
<!-- MD5加密 -->
<script type="text/javascript" src="<%=contextPath%>/js/md5.js"></script>
<!-- IE6下PNG透明问题修复 -->
<script type="text/javascript" src="<%=contextPath%>/js/MSIE.PNG.js"></script>

