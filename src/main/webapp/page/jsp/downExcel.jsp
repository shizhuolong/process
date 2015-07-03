<%@ page import="java.net.URLEncoder" contentType="text/html;charset=GBK"%>
<%   
      String fileName = request.getParameter("fileName");  
	  String filePath = request.getParameter("filePath");
	  String filedisplay = request.getParameter("filedisplay");//下载文件时显示的文件保存名称 
	  if(filePath==null || filePath.equals("")){
		  filePath="/page/down/";//  /report
	  } 
	  if(filedisplay!=null && !filedisplay.equals("")){ //有则优先使用
    	  filedisplay = URLEncoder.encode(filedisplay,"UTF-8"); //filedisplay不能为null!
      }else if(fileName!=null && !fileName.equals("")){
		  filedisplay = fileName;//下载文件时显示的文件保存名称 
		  filedisplay = URLEncoder.encode(filedisplay,"UTF-8");
	  }else{
    	  filedisplay = "url传递filedisplay参数";
      }
      
      String filedownload =filePath+ fileName; // 生成的excel文件存放到指定目录,必须是/开头    
      response.setContentType("application/x-download");
      response.addHeader("Content-Disposition","attachment;filename=" + filedisplay);
      System.out.println("downExcel.jsp filedownload=" + filedownload);
      try{
          RequestDispatcher dis = application.getRequestDispatcher(filedownload);
          if(dis!= null){
              dis.forward(request,response);
          } 
      }
      catch(Exception e){
      } finally{ 
    	  response.flushBuffer();
          out.clear();
    	  out = pageContext.pushBody();
      }
%>
