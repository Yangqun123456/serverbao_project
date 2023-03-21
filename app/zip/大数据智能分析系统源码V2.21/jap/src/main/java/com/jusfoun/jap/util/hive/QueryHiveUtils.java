package com.jusfoun.jap.util.hive;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.jusfoun.jap.util.Constant;

public class QueryHiveUtils {
	private static Connection conn=JDBCToHiveUtils.getConnnection(Constant.HIVE_URL+Constant.HIVE_ANALYSIS_DATABASE);

    private static PreparedStatement ps;

    private static ResultSet rs;

    public static void getAll(String tablename)

    {

        String sql="select * from "+tablename;

        System.out.println(sql);

        try {

            ps=JDBCToHiveUtils.prepare(conn, sql);

            rs=ps.executeQuery();

            int columns=rs.getMetaData().getColumnCount();

            while(rs.next())

            {

                for(int i=1;i<=columns;i++)

                {

                    System.out.print(rs.getString(i));

                    System.out.print("\t\t");

                }

                System.out.println();

            }

        } catch (SQLException e) {

            // TODO Auto-generated catch block

            e.printStackTrace();

        }

 

    }
}
