package com.jusfoun.jap.cube.util;

public class CubeConstants {

	/**
	 * 同步状态：0:待执行1：同步数据 2：创建数据集 9：同步完成
	 * @author syk
	 *
	 */
	public interface SyncStatus
	{
		int REDAY_EXEC = 0;
		int SYNC_DATA = 1;
		int BULID_CUBE = 2;
		int EXEC_COMPLATE= 9;
	}
	
	
}
