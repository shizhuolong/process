package org.apdplat.platform.util;

import org.apdplat.platform.log.APDPlatLogger;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 *验证XML是否合法
 * @author sun
 */
public class XMLUtils {
    protected static final APDPlatLogger LOG = new APDPlatLogger(XMLUtils.class);

    private XMLUtils() {
    }

    /**
     *验证类路径资源中的XML是否合法
     * @param xml 类路径资源
     * @return 是否验证通过
     */
    public static boolean validateXML(String xml) {
        if (!xml.startsWith("/")) {
            xml = "/" + xml;
        }
        String xmlPath = FileUtils.getAbsolutePath("/WEB-INF/classes" + xml);
        try {
            InputStream in = new FileInputStream(xmlPath);
            return validateXML(in);
        } catch (FileNotFoundException ex) {
            LOG.error("构造XML文件失败", ex);
        }
        return false;
    }
    /**
     *验证类路径资源中的XML是否合法
     * @param in XML文件输入流
     * @return 是否验证通过
     */
    public static boolean validateXML(InputStream in) {
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setValidating(true);
            DocumentBuilder builder = dbf.newDocumentBuilder();
            builder.parse(new InputSource(in));
            return true;
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            LOG.error("验证XML失败",ex);
        }
        return false;
    }
}