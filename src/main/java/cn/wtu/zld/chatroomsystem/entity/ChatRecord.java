package cn.wtu.zld.chatroomsystem.entity;

import lombok.Data;

import java.util.Date;

@Data
public class ChatRecord {
    private String userAccount;
    private String friendAccount;
    private String text;
    private String time;
}
