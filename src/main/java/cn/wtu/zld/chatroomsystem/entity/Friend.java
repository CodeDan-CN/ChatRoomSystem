package cn.wtu.zld.chatroomsystem.entity;

import lombok.Data;

import java.util.Date;


/**
 * POJO类，用于好友对象的接收
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Data
public class Friend {
    private String userAccount;
    private String name;
    private String photo;
    private String friendEndText;
    private String friendEndTime;
    private String friendEndBackTime;
    private Date endTime;
    private Date endBackTime;
    private int unReadNumber;
}
