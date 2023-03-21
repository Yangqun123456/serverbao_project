package com.jusfoun.jap.util.hive;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.jusfoun.jap.util.Constant;

public class JDBCToHiveUtils {
	
	private static Connection conn;


	public static Connection getConnnection(String url) {
		try {
			conn = DriverManager.getConnection(url, "", ""); // 此处的用户名一定是有权限操作HDFS的用户，否则程序会提示"permission
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}

	public static PreparedStatement prepare(Connection conn, String sql) {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ps;
	}

	public static void closeConnection(Connection con) {
		if (con != null) {
			try {
				con.close();
			} catch (Exception ex) {
			}
		}
	}

	public static void closeConnection(Connection con, Statement stat) {
		// 释放stat
		if (stat != null) {
			try {
				stat.close();
			} catch (Exception ex) {
			}
		}
		// 释放con
		closeConnection(con);
	}

	public static void closeConnection(Connection con, Statement stat, ResultSet rs) {
		// 释放rs
		if (rs != null) {
			try {
				rs.close();
			} catch (Exception ex) {
			}
		}
		// 释放stat,con
		closeConnection(con, stat);
	}
}
