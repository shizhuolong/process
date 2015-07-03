package com.lch.report.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
 
public class CompilerUtil {
    private static CompilerUtil ourInstance = null;
    private Map<String, Object> instances=new HashMap<String, Object>();
    public static synchronized CompilerUtil getInstance() {
    	if(null==ourInstance){
    		ourInstance = new CompilerUtil();
    	}
        return ourInstance;
    }
    private ClassLoader parentClassLoader;
    private String classpath;
    private CompilerUtil() {
        this.parentClassLoader = (ClassLoader) this.getClass().getClassLoader();
        this.buildClassPath();
    }
    private void buildClassPath() {
    	try{
	        this.classpath = null;
	        StringBuilder sb = new StringBuilder();
	        Enumeration<URL> urls=this.parentClassLoader.getResources("");
	        URL url=null;
	        while(urls!=null&&urls.hasMoreElements()){
	        	url=urls.nextElement();
	        	String p = url.getFile();
	            sb.append(p).append(File.pathSeparator);
	        }
	        this.classpath = sb.toString();
    	}catch(Exception e){e.printStackTrace();}
    }
    public Object javaCodeToObject(String fullClassName, String javaCode) throws IllegalAccessException, InstantiationException {
        long start = System.currentTimeMillis();
        Object instance = null;
        if(instances.containsKey(fullClassName)){
        	instance=instances.get(fullClassName);
        }else{
		        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<JavaFileObject>();
		        ClassFileManager fileManager = new ClassFileManager(compiler.getStandardFileManager(diagnostics, null, null));
		 
		        List<JavaFileObject> jfiles = new ArrayList<JavaFileObject>();
		        jfiles.add(new CharSequenceJavaFileObject(fullClassName, javaCode));
		 
	        List<String> options = new ArrayList<String>();
	        options.add("-encoding");
	        options.add("UTF-8");
	        options.add("-classpath");
	        options.add(this.classpath);
	 
	        JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnostics, options, null, jfiles);
	        boolean success = task.call();
	 
	        if (success) {
	            JavaClassObject jco = fileManager.getJavaClassObject();
	            DynamicClassLoader dynamicClassLoader = new DynamicClassLoader(this.parentClassLoader);
	            Class clazz = dynamicClassLoader.loadClass(fullClassName,jco);
	            instance = clazz.newInstance();
	            instances.put(fullClassName, instance);
	        } else {
	            String error = "";
	            for (Diagnostic diagnostic : diagnostics.getDiagnostics()) {
	                error = error + compilePrint(diagnostic);
	            }
	        }
        }
        long end = System.currentTimeMillis();
        System.out.println("javaCodeToObject use:"+(end-start)+"ms");
        return instance;
    }
 
    private String compilePrint(Diagnostic diagnostic) {
        System.out.println("Code:" + diagnostic.getCode());
        System.out.println("Kind:" + diagnostic.getKind());
        System.out.println("Position:" + diagnostic.getPosition());
        System.out.println("Start Position:" + diagnostic.getStartPosition());
        System.out.println("End Position:" + diagnostic.getEndPosition());
        System.out.println("Source:" + diagnostic.getSource());
        System.out.println("Message:" + diagnostic.getMessage(null));
        System.out.println("LineNumber:" + diagnostic.getLineNumber());
        System.out.println("ColumnNumber:" + diagnostic.getColumnNumber());
        StringBuffer res = new StringBuffer();
        res.append("Code:[" + diagnostic.getCode() + "]\n");
        res.append("Kind:[" + diagnostic.getKind() + "]\n");
        res.append("Position:[" + diagnostic.getPosition() + "]\n");
        res.append("Start Position:[" + diagnostic.getStartPosition() + "]\n");
        res.append("End Position:[" + diagnostic.getEndPosition() + "]\n");
        res.append("Source:[" + diagnostic.getSource() + "]\n");
        res.append("Message:[" + diagnostic.getMessage(null) + "]\n");
        res.append("LineNumber:[" + diagnostic.getLineNumber() + "]\n");
        res.append("ColumnNumber:[" + diagnostic.getColumnNumber() + "]\n");
        return res.toString();
    }
    
    public static void main(String[] args) throws Exception {
        String fullName = "com.lch.report.power.UnitOrgPower";
    	String src="";
    	src+=" package com.lch.report.power;                                          ";
    	src+="                                                                        ";
    	src+=" import org.apdplat.module.security.model.Org;                          ";
    	src+=" import org.apdplat.module.security.model.User;                         ";
    	src+=" import org.apdplat.module.security.service.UserHolder;                 ";
    	src+="                                                                        ";
    	src+=" public class UnitOrgPower {                                            ";
    	src+=" 	public String getPowerSql(){                                          ";
    	src+=" 		String s=\"\";                                                    ";
    	src+=" 		User user = UserHolder.getCurrentLoginUser();                     ";
    	src+=" 		Org org = user.getOrg();                                          ";
    	src+=" 		String level=org.getOrgLevel();                                   ";
    	src+=" 		String code=org.getCode();                                        ";
    	src+=" 		if(\"2\".equals(level)){                                          ";
    	src+=" 			s=  \" and t.GROUP_ID_1='\"+code+\"' \";                      ";
    	src+=" 		}else if(\"3\".equals(level)){                                    ";
    	src+=" 			s=  \" and t.unit_id='\"+code+\"' \";                         ";
    	src+=" 		}else if(\"4\".equals(level)){                                    ";
    	src+=" 			s=  \" and t.GROUP_ID_4='\"+code+\"' \";                      ";
    	src+=" 		}else if(4>Integer.parseInt(level)){                              ";
    	src+=" 			s= \" and 1=2 \";                                             ";
    	src+=" 		}                                                                 ";
    	src+=" 		return s;                                                         ";
    	src+=" 	}                                                                     ";
    	src+=" }                                                                      ";
 
        System.out.println(src);
        CompilerUtil de = CompilerUtil.getInstance();
        Object instance =  de.javaCodeToObject(fullName,src.toString());
        System.out.println(instance);
        //调用方法
        Class clazz=instance.getClass();
        Method method=clazz.getDeclaredMethod("getPowerSql", new Class[]{});
        
        Object r= method.invoke(instance);
        System.out.println("执行结果："+r);
        
    }
}
class CharSequenceJavaFileObject extends SimpleJavaFileObject {
	 
    private CharSequence content;
 
 
    public CharSequenceJavaFileObject(String className,
                                      CharSequence content) {
        super(URI.create("string:///" + className.replace('.', '/')
                + JavaFileObject.Kind.SOURCE.extension), JavaFileObject.Kind.SOURCE);
        this.content = content;
    }
 
    @Override
    public CharSequence getCharContent(
            boolean ignoreEncodingErrors) {
        return content;
    }
}

class ClassFileManager extends ForwardingJavaFileManager {
	public JavaClassObject getJavaClassObject() {
		return jclassObject;
	}

	private JavaClassObject jclassObject;

	public ClassFileManager(StandardJavaFileManager standardManager) {
		super(standardManager);
	}

	@Override
	public JavaFileObject getJavaFileForOutput(Location location,
			String className, JavaFileObject.Kind kind, FileObject sibling)
			throws IOException {
		jclassObject = new JavaClassObject(className, kind);
		return jclassObject;
	}
}
class JavaClassObject extends SimpleJavaFileObject {
	 
    protected final ByteArrayOutputStream bos =
        new ByteArrayOutputStream();
 
 
    public JavaClassObject(String name, JavaFileObject.Kind kind) {
        super(URI.create("string:///" + name.replace('.', '/')
            + kind.extension), kind);
    }
 
 
    public byte[] getBytes() {
        return bos.toByteArray();
    }
 
    @Override
    public OutputStream openOutputStream() throws IOException {
        return bos;
    }
}
class DynamicClassLoader extends URLClassLoader {
    public DynamicClassLoader(ClassLoader parent) {
        super(new URL[0], parent);
    }
 
    public Class findClassByClassName(String className) throws ClassNotFoundException {
        return this.findClass(className);
    }
 
    public Class loadClass(String fullName, JavaClassObject jco) {
        byte[] classData = jco.getBytes();
        return this.defineClass(fullName, classData, 0, classData.length);
    }
}