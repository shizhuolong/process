package org.apdplat.module.workflow;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;

public class Read {
	public static void main(String[] args) {
		try {
			File f = new File("/home/lyz/test/xxzz.js");
			File fo = new File("/home/lyz/test/xxzz_out.js");
			BufferedReader r = new BufferedReader(new FileReader(f));
			FileOutputStream os=new FileOutputStream(fo);
			String line;
			
			while((line=r.readLine())!=null){
				String nline="";
				for(int i=0;i<line.length();i++){
					if(i<line.length()-1){
						String start=line.substring(i,i+2);
						if(start.equals("\\u")){
							String unicode=line.substring(i+2,i+6);
							int data = Integer.parseInt(unicode, 16);
							nline+=(char)data;
							i+=5;
						}else{
							nline+=line.substring(i,i+1);
						}
					}else{
						nline+=line.substring(i,i+1);
					}
				}
				nline+="\r\n";
				os.write(nline.getBytes(), 0, nline.getBytes().length);
				System.out.println(nline);
			}
			r.close();
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
