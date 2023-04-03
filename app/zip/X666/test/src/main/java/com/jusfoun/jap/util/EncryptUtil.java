package com.jusfoun.jap.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 利用JAVA提供的MessageDigest进行加密处理
 * 
 * @author Administrator
 */
public class EncryptUtil
{
    public EncryptUtil()
    {
    }

    /**
     * @param strSrc 待加密字符串
     * @param encName 加密算法名称(example:MD5、SHA-1、SHA-256)
     * @return
     */
    public static String encrypt(String strSrc, String encName)
    {
        MessageDigest md = null;
        String strDes = null;
        byte[] bt = strSrc.getBytes();
        try
        {
            if (encName == null || "".equals(encName))
            {
                encName = "MD5";
            }
            md = MessageDigest.getInstance(encName);
            md.update(bt);
            strDes = bytes2Hex(md.digest()); // to HexString
        }
        catch (NoSuchAlgorithmException e)
        {
            System.out.println("Invalid algorithm.");
            return null;
        }
        return strDes;
    }

    /**
     * 返回hex字符串
     * 
     * @param bts
     * @return
     */
    public static String bytes2Hex(byte[] bts)
    {
        String des = "";
        String tmp = null;
        for (int i = 0; i < bts.length; i++)
        {
            tmp = (Integer.toHexString(bts[i] & 0xFF));
            if (tmp.length() == 1)
            {
                des += "0";
            }
            des += tmp;
        }
        return des;
    }
}
