<%@ page import="java.net.URLEncoder" contentType="text/html;charset=GBK"%>
<%   
      String fileName = request.getParameter("fileName");  
	  String filePath = request.getParameter("filePath");
	  String filedisplay = request.getParameter("filedisplay");//�����ļ�ʱ��ʾ���ļ��������� 
	  if(filePath==null || filePath.equals("")){
		  filePath="/page/down/";//  /report
	  } 
	  if(filedisplay!=null && !filedisplay.equals("")){ //��������ʹ��
    	  filedisplay = URLEncoder.encode(filedisplay,"UTF-8"); //filedisplay����Ϊnull!
      }else if(fileName!=null && !fileName.equals("")){
		  filedisplay = fileName;//�����ļ�ʱ��ʾ���ļ��������� 
		  filedisplay = URLEncoder.encode(filedisplay,"UTF-8");
	  }else{
    	  filedisplay = "url����filedisplay����";
      }
      
      String filedownload =filePath+ fileName; // ���ɵ�excel�ļ���ŵ�ָ��Ŀ¼,������/��ͷ    
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
