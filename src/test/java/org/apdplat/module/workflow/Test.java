package org.apdplat.module.workflow;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {
	public static void main(String[] agrs) throws IOException{

        try
        {
            URL url= new URL("http://wap.kuaidi100.com/wap_result.jsp?rand=90210&id=shunfeng&fromWeb=null&postid=920173973504&sub=查询");
            URLConnection con=url.openConnection();
            con.setAllowUserInteraction(false);
            InputStream urlStream = url.openStream();
            String type = con.guessContentTypeFromStream(urlStream);
            String charSet=null;
            if (type == null)
                type = con.getContentType();

            if (type == null || type.trim().length() == 0 || type.trim().indexOf("text/html") < 0)
                return ;

            if(type.indexOf("charset=") > 0)
                charSet = type.substring(type.indexOf("charset=") + 8);

            byte b[] = new byte[10000];
            int numRead = urlStream.read(b);
            String content = new String(b, 0, numRead);
            while (numRead != -1) {
                numRead = urlStream.read(b);
                if (numRead != -1) {
                    //String newContent = new String(b, 0, numRead);
                    String newContent = new String(b, 0, numRead, charSet);
                    content += newContent;
                }
            }
            //System.out.println("content:" + content);
            ///////////////////////
            List<String[]> info= parseHtml(content);
            for(String[] s:info){
            	System.out.println(s[0]+"\t"+s[1]);
            }
            ///////////////////////
            urlStream.close();
        } catch (MalformedURLException e)
        {
            e.printStackTrace();
        } catch (IOException e)
        {
            e.printStackTrace();
        }
    }
	public static List<String[]> parseHtml(String html){
		Pattern p = Pattern.compile("<strong>查询结果如下所示：</strong></p>([\\s\\S]*)</form>");
  		Matcher m = p.matcher(html);
  		List<String[]> result=new ArrayList<String[]>();
  		while(m.find()){
  			String tmp=m.group();
  			tmp=tmp.replaceAll("<strong>查询结果如下所示：</strong></p>|</form>|\\r|\\n", "");
  			String[] ss=tmp.split("</p> *<p>");
  			for(String s:ss){
  				String[] r=s.split("<br */>");
  				if(r!=null&&r.length>=2){
  					r[0]=r[0].replaceAll("<p>|&middot;|</p>", "").trim();
  					r[1]=r[1].replaceAll("<p>|&middot;|</p>", "").trim();
  					result.add(r);
  				}
  			}
  			break;
  		}
  		return result;
	}
	
}
