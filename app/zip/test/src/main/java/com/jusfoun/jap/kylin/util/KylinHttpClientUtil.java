package com.jusfoun.jap.kylin.util;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;

import com.jusfoun.jap.util.Constant;

public class KylinHttpClientUtil {

	private static final Logger LOGGER = Logger.getLogger(KylinHttpClientUtil.class);

	public static final String CONTENT_TYPE = "application/json;charset=UTF-8";
	public static final String UTF_8 = "UTF-8";
	public static final int CONNECTION_TIMEOUT = 60000;

	private static RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(CONNECTION_TIMEOUT)
			.setConnectTimeout(CONNECTION_TIMEOUT).build();

	/**
	 * 发送 post请求
	 * 
	 * @param httpUrl
	 *            地址
	 * @param maps
	 *            参数
	 * @throws Exception 
	 */
	public static String sendHttpPost(String url, String json) throws Exception {
		HttpPost httpPost = new HttpPost(url);// 创建httpPost
		httpPost.addHeader("Authorization", Constant.KYLIN_AUTHORIZATION);
		httpPost.addHeader("content-type", CONTENT_TYPE);
		StringEntity entity = new StringEntity(json, UTF_8);
		entity.setContentType(CONTENT_TYPE);
		httpPost.setEntity(entity);
		return sendHttpPost(httpPost);
	}

	/**
	 * 发送Post请求
	 * 
	 * @param httpPost
	 * @return
	 * @throws Exception 
	 */
	private static String sendHttpPost(HttpPost httpPost) throws Exception {
		CloseableHttpClient httpClient = null;
		CloseableHttpResponse response = null;
		HttpEntity entity = null;
		String responseContent = null;
		try {
			// 创建默认的httpClient实例.
			httpClient = HttpClients.createDefault();
			httpPost.setConfig(requestConfig);
			// 执行请求
			response = httpClient.execute(httpPost);
			int statusCode = response.getStatusLine().getStatusCode();
			entity = response.getEntity();
        	responseContent = EntityUtils.toString(entity, UTF_8);
            if (statusCode != HttpStatus.SC_OK) {
            	LOGGER.error("responseContent=" + responseContent);
            	throw new Exception(responseContent);
            }
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		} finally {
			try {
				// 关闭连接,释放资源
				if (response != null) {
					response.close();
				}
				if (httpClient != null) {
					httpClient.close();
				}
			} catch (IOException e) {
				LOGGER.error(e.getMessage(), e);
				throw e;
			}
		}
		return responseContent;
	}

	/**
	 * 发送 get请求
	 * 
	 * @param httpUrl
	 * @throws Exception 
	 */
	public static String sendHttpGet(String httpUrl) throws Exception {
		//封装参数
		HttpGet httpGet = new HttpGet(httpUrl);// 创建get请求
		httpGet.addHeader("Authorization", Constant.KYLIN_AUTHORIZATION);
		httpGet.addHeader("content-type", CONTENT_TYPE);
		return sendHttpGet(httpGet);
	}

	/**
	 * 发送Get请求
	 * 
	 * @param httpPost
	 * @return
	 * @throws Exception 
	 */
	private static String sendHttpGet(HttpGet httpGet) throws Exception {
		CloseableHttpClient httpClient = null;
		CloseableHttpResponse response = null;
		HttpEntity entity = null;
		String responseContent = null;

		try {
			// 创建默认的httpClient实例.
			httpClient = HttpClients.createDefault();
			httpGet.setConfig(requestConfig);
			// 执行请求
			response = httpClient.execute(httpGet);
			int statusCode = response.getStatusLine().getStatusCode();
			entity = response.getEntity();
			responseContent = EntityUtils.toString(entity, "UTF-8");
			if (statusCode != HttpStatus.SC_OK) {
            	LOGGER.error("responseContent=" + responseContent);
            	throw new Exception(responseContent);
            }
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		} finally {
			try {
				// 关闭连接,释放资源
				if (response != null) {
					response.close();
				}
				if (httpClient != null) {
					httpClient.close();
				}
			} catch (IOException e) {
				LOGGER.error(e.getMessage(), e);
				throw e;
			}
		}
		return responseContent;
	}

	/**
	 * 发送 get请求
	 * 
	 * @param httpUrl
	 * @throws Exception 
	 */
	public static String sendHttpPut(String httpUrl, String json) throws Exception {
		//封装参数
		HttpPut httpPut = new HttpPut(httpUrl);// 创建get请求
		httpPut.addHeader("Authorization", Constant.KYLIN_AUTHORIZATION);
		httpPut.addHeader("content-type", CONTENT_TYPE);
		StringEntity entity = new StringEntity(json, UTF_8);
		entity.setContentType(CONTENT_TYPE);
		httpPut.setEntity(entity);
		return sendHttpPut(httpPut);
	}

	/**
	 * 发送Get请求
	 * 
	 * @param httpPost
	 * @return
	 * @throws Exception 
	 */
	private static String sendHttpPut(HttpPut httpPut) throws Exception {
		CloseableHttpClient httpClient = null;
		CloseableHttpResponse response = null;
		HttpEntity entity = null;
		String responseContent = null;

		try {
			// 创建默认的httpClient实例.
			httpClient = HttpClients.createDefault();
			httpPut.setConfig(requestConfig);
			// 执行请求
			response = httpClient.execute(httpPut);
			int statusCode = response.getStatusLine().getStatusCode();
			entity = response.getEntity();
			responseContent = EntityUtils.toString(entity, "UTF-8");
			if (statusCode != HttpStatus.SC_OK) {
            	LOGGER.error("responseContent=" + responseContent);
            	throw new Exception(responseContent);
            }
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		} finally {
			try {
				// 关闭连接,释放资源
				if (response != null) {
					response.close();
				}
				if (httpClient != null) {
					httpClient.close();
				}
			} catch (IOException e) {
				LOGGER.error(e.getMessage(), e);
				throw e;
			}
		}
		return responseContent;
	}
}
