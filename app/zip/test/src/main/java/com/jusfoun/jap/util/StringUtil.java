package com.jusfoun.jap.util;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Pattern;

public final class StringUtil
{
    
    /**
     * 如果对象Null或"null"返回空字符串.
     * 
     * @param obj 需要toString的对象
     * @return string 返回非空的字符串
     */
    public static String notNull(Object obj)
    {
        return notNull(obj, false);
    }

    /**
     * Not null.
     * 
     * @param obj the obj
     * @param stutas the stutas 是否严格校验 "null"字符串
     * @return the string
     */
    public static String notNull(Object obj, boolean stutas)
    {
        String strString = "";
        if (obj != null)
        {
            if (stutas)
            {
                strString = obj.toString();
            }
            else
            {
                strString = obj.toString().trim();
                if ("null".equals(strString))
                {
                    return "";
                }
            }
        }
        return strString;
    }

    public static boolean isNull(Object obj)
    {
        if (obj != null)
        {
            String str = obj.toString().trim();
            return str.isEmpty() || "null".equals(str.toLowerCase());
        }
        else
        {
            return true;
        }
    }

    public static String valueOf(Object value)
    {
        return value != null ? String.valueOf(value) : "";
    }

    /**
     * Checks if is empty.
     * 
     * @param str the str
     * @return true, if is empty
     */
    public static boolean isEmpty(Object str)
    {
        return str == null || str.toString().isEmpty();
    }

    /**
     * Checks if is not empty.
     * 
     * @param str the str
     * @return true, if is not empty
     */
    public static boolean isNotEmpty(Object str)
    {
        return !StringUtil.isEmpty(str);
    }

    /**
     * 方法定义：toBoolean<br>
     * 用途说明： 将字符串y|yes|true|1 转换成true否则false<br>
     * 例如：toBoolean("y") 返回true.
     * 
     * @param theString 需要判断的字符串
     * @return boolean 返回布尔值true|false
     */
    public static boolean toBoolean(String theString)
    {
        if (theString == null)
        {
            return false;
        }
        theString = theString.trim();
        if (theString.equalsIgnoreCase("y") || theString.equalsIgnoreCase("yes") || theString.equalsIgnoreCase("true")
                || theString.equalsIgnoreCase("1"))
        {
            return true;
        }
        return false;
    }

    public static boolean toBoolean(Object obj)
    {
        if (obj == null)
        {
            return false;
        }
        return toBoolean(obj.toString());
    }

    /**
     * 将字符串按指定加密类型加密支持MD5 SHA-1.
     * 
     * @param data 需要Hash的字符串
     * @param type 加密类型 （"MD5" or "SHA-1"）
     * @return 返回的加密字串，SHA1是产生一个20字节的二进制数组
     */
    public static synchronized String hashKey(String data, String type)
    {
        MessageDigest digest = null;
        if (digest == null)
        {
            try
            {
                digest = MessageDigest.getInstance(type);
            }
            catch (NoSuchAlgorithmException nsae)
            {
                System.err.println("Failed to load the MD5 MessageDigest. ");
            }
        }
        digest.update(data.getBytes());
        return byteToHex(digest.digest());
    }

    /**
     * 字符串不能为"" 或 null 如果是则返回异常.
     * 
     * @param theString 需要断言的字符串
     * @param theMessage 是null或空白时,相应的错误提示信息
     * @throws IllegalArgumentException
     *             是一个RuntimeException运行时异常不强制捕获异常，如果需要时可以主动捕获异常。
     */
    public static void assertNotBlank(String theString, String theMessage)
    {
        if (theString == null)
        {
            throw new IllegalArgumentException("Null argument not allowed: " + theMessage);
        }
        if ("".equals(theString.trim()))
        {
            throw new IllegalArgumentException("Blank argument not allowed: " + theMessage);
        }
    }

    /**
     * 判断指定的String是否为一个Integer 整数.
     * 
     * @param theString 需要断言的字符串
     * @param theMessage 不是number时,相应的错误提示信息
     * @return the int
     * @throws IllegalArgumentException 如果表示number,则throw 此exception,
     * @see #assertNotBlank(String,String)
     */
    public static int assertInteger(String theString, String theMessage)
    {
        assertNotBlank(theString, theMessage);
        try
        {
            int result = Integer.parseInt(theString);
            return result;
        }
        catch (NumberFormatException e)
        {
            throw new IllegalArgumentException("[" + theString + "]is not a integer value." + theMessage);
        }
    }

    /**
     * 获取字符32位字符串的UUID（唯一）.
     * 
     * @return the UUID
     */
    public static String getUUID()
    {
        String uuid = java.util.UUID.randomUUID().toString();
        return uuid.replaceAll("-", "");
    }

    /**
     * 获取UUID的HashCode.
     * 
     * @return the uUID hash code
     */
    public static long getUUIDHashCode()
    {
        return getUUID().hashCode();
    }

    /**
     * 获取Long型的UUID（唯一）.
     * 
     * @return the UUID least bits
     */
    public static long getUUID2Long()
    {
        return java.util.UUID.randomUUID().getLeastSignificantBits() * -1;
    }

    /**
     * 判断指定的String是否为一个boolean.
     * 
     * @param theString 需要断言的字符串
     * @param theMessage 不是boolean时,相应的错误提示信息
     * @throws IllegalArgumentException 如果表示boolean,则throw 此exception,
     * @see #assertNotBlank(String,String)
     */
    public static void assertBoolean(String theString, String theMessage)
    {
        assertNotBlank(theString, theMessage);
        if (!(theString.equalsIgnoreCase("yes") || theString.equalsIgnoreCase("true")
                || theString.equalsIgnoreCase("no") || theString.equalsIgnoreCase("false")
                || theString.equalsIgnoreCase("y") || theString.equalsIgnoreCase("n")))
        {
            throw new IllegalArgumentException("[" + theString + "]is not a boolean value." + theMessage);
        }
    }

    /**
     * 用于把Request para 的encoding <br>
     * 从缺省的ISO8859-5 转换为指定的Encoding.
     * 
     * @param value the value
     * @param newEncoding , if = null, default set to "GBK"
     * @return 做过Encoding变换的String
     * @history 2004/06/25 getBytes的时候应该指定用ISO-8859-1
     */
    public static String convertEncoding(String value, String newEncoding)
    {
        if (value == null)
        {
            return "";
        }
        if (newEncoding == null)
        {
            newEncoding = "GBK";
        }
        try
        {
            return new String(value.getBytes("ISO-8859-1"), newEncoding);
        }
        catch (java.io.UnsupportedEncodingException use)
        {
            return use.toString();
        }
    }

    /**
     * 字节数组转换为十六进制字符串.
     * 
     * @param hash 需要转换的字节数组
     * @return 返回的十六进制字符串
     */
    public static String byteToHex(byte hash[])
    {
        StringBuffer buf = new StringBuffer(hash.length * 2);
        int i;
        for (i = 0; i < hash.length; i++)
        {
            if ((hash[i] & 0xff) < 0x10)
            {
                buf.append("0");
            }
            buf.append(Long.toString(hash[i] & 0xff, 16));
        }
        return buf.toString();
    }

    /**
     * 对字符串进行处理，使得它能够在HTML页面上进行正常表示 <br />
     * 具体转换的内容是： <table border="1">
     * <tr>
     * <td>原内容</td>
     * <td>转换后</td>
     * </tr>
     * <tr>
     * <td>"<" </td>
     * <td>"&amp;lt;" </td>
     * </tr>
     * <tr>
     * <td>">" </td>
     * <td>"&amp;gt;" </td>
     * </tr>
     * <tr>
     * <td>"&" </td>
     * <td>"&amp;amp;" </td>
     * </tr>
     * <tr>
     * <td>"\"' </td>
     * <td>"&amp;quot;" </td>
     * </tr>
     * <tr>
     * <td>"\r" </td>
     * <td> "&lt;BR&gt;"</td>
     * </tr>
     * <tr>
     * <td>"\n" </td>
     * <td>"&lt;BR&gt;" </td>
     * </tr>
     * <tr>
     * <td>"\t" </td>
     * <td>4个Space </td>
     * </tr>
     * <tr>
     * <td>Space </td>
     * <td>"&amp;nbsp;" </td>
     * </tr>
     * </table>.
     * 
     * @param value 目标字符串
     * @return 返回字符串
     */
    public static String filter(String value)
    {
        if (value == null)
        {
            return null;
        }
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < value.length(); i++)
        {
            char ch = value.charAt(i);
            if (ch == '<')
            {
                result.append("&lt;");
            }
            else if (ch == '>')
            {
                result.append("&gt;");
            }
            else if (ch == '&')
            {
                result.append("&amp;");
            }
            else if (ch == '"')
            {
                result.append("&quot;");
            }
            else if (ch == '\r')
            {
                result.append("<BR>");
            }
            else if (ch == '\n')
            {
                if (!(i > 0 && value.charAt(i - 1) == '\r'))
                {
                    result.append("<BR>");
                }
            }
            else if (ch == '\t')
            {
                result.append("&nbsp;&nbsp;&nbsp;&nbsp");
            }
            else if (ch == ' ')
            {
                result.append("&nbsp;");
            }
            else
            {
                result.append(ch);
            }
        }
        return result.toString();
    }

    /**
     * 对目前的支持Word联动的HTML编辑器的Filter功能.
     * 
     * @param value the value
     * @return String
     */
    public static String filterForHtmlEditor(String value)
    {
        if (value == null)
        {
            return null;
        }
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < value.length(); i++)
        {
            char ch = value.charAt(i);
            if (ch == '\r')
            {
                result.append("");
            }
            else if (ch == '\n')
            {
                if (!(i > 0 && value.charAt(i - 1) == '\r'))
                {
                    result.append("");
                }
            }
            else if (ch == '\t')
            {
                result.append("    ");
            }
            else
            {
                result.append(ch);
            }
        }
        return result.toString();
    }

    /**
     * 数字转换成字母.
     * 
     * @param number the number
     * @param upperCaseFlag 大小写标示
     * @return java.lang.String
     * @throws Exception the exception
     */
    public static String numberToLetter(int number, boolean upperCaseFlag) throws Exception
    {
        // add nine to bring the numbers into the right range (in java, a= 10, z
        // = 35)
        if (number < 1 || number > 26)
        {
            throw new Exception("The number is out of the proper range (1 to " + "26) to be converted to a letter.");
        }
        int modnumber = number + 9;
        char thechar = Character.forDigit(modnumber, 36);
        if (upperCaseFlag)
        {
            thechar = Character.toUpperCase(thechar);
        }
        return "" + thechar;
    }

    /**
     * 字符串转换成整数.
     * 
     * @param value the value
     * @return the integer
     */
    public static Integer string2Integer(String value)
    {
        if (value != null && value.length() > 0)
        {
            boolean flag = Pattern.matches("-?\\d+", value);
            if (flag)
            {
                return Integer.valueOf(value);
            }
            else
            {
                throw new NumberFormatException();
            }
        }
        else
        {
            return null;
        }
    }

    /**
     * 字符串转换成长整数.
     * 
     * @param value the value
     * @return the long
     */
    public static Long string2Long(String value)
    {
        if (value != null && value.length() > 0)
        {
            boolean flag = Pattern.matches("-?\\d+", value);
            if (flag)
            {
                return Long.valueOf(value);
            }
            else
            {
                throw new NumberFormatException();
            }
        }
        else
        {
            return null;
        }
    }

    /**
     * 字符串转换成小数.
     * 
     * @param value the value
     * @return the big decimal
     */
    public static BigDecimal string2BigDecimal(String value)
    {
        if (value != null && value.length() > 0)
        {
            boolean flag = Pattern.matches("-?[0-9]+(.[0-9]+)?", value);
            if (flag)
            {
                return new BigDecimal(value);
            }
            else
            {
                throw new NumberFormatException();
            }
        }
        else
        {
            return null;
        }
    }

    /**
     * 字符串转换成短整数.
     * 
     * @param value the value
     * @return the short
     */
    public static Short string2Short(String value)
    {
        if (value != null && value.length() > 0)
        {
            boolean flag = Pattern.matches("-?\\d+", value);
            if (flag)
            {
                return Short.valueOf(value);
            }
            else
            {
                throw new NumberFormatException();
            }
        }
        else
        {
            return null;
        }
    }

    /**
     * 字符串转换成短整数.
     * 
     * @param value the value
     * @return the byte[]
     */
    public static byte[] string2Blob(String value)
    {
        if (value != null && value.length() > 0)
        {
            return value.getBytes();
        }
        else
        {
            return null;
        }
    }

    /**
     * To string.
     * 
     * @param object object
     * @return string
     */
    public static String toString(Object object)
    {
        String value = String.valueOf(object);
        if ("null".equals(value))
        {
            return null;
        }
        return value;
    }

    /**
     * 特殊字符转义.
     * 
     * @param specialCharacters 包含特殊字符的字符串
     * @return 返回转义后的字符串
     */
    public static String escapeSpecialCharacters(String specialCharacters)
    {
        return specialCharacters.replaceAll(Pattern.quote("\\"), "\\\\\\\\").replaceAll("%", "\\\\%").replaceAll("_",
                "\\\\_");
    }

    /**
     * 处理字符串空值 nvl
     * 
     * @param s
     * @return
     */
    public static String nvl(String s)
    {
        return nvl(s, "");
    }

    /**
     * 带默认值处理字符串空值 nvl
     * 
     * @param s
     * @param defaultValue
     * @return
     */
    public static String nvl(String s, String defaultValue)
    {
        if (s == null || "".equals(s) || "null".equals(s))
        {
            s = defaultValue;
        }
        return s;
    }

    /**
     * 将NULL的OBJECT转化为字符串"&nbsp"
     * 
     * @param obj
     * @return
     */
    public static String null2HtmlBlank(Object obj)
    {
        if (obj == null)
        {
            return "&nbsp";
        }
        else
        {
            return String.valueOf(obj);
        }
    }


    public static boolean isEmptyByObject(Object value)
    {
        return value == null ? true : value.toString().isEmpty() ? true : false;
    }

    public static boolean isNotEmptyByObject(Object value)
    {
        return !isEmpty(value);
    }

}
