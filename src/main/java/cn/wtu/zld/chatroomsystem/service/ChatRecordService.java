package cn.wtu.zld.chatroomsystem.service;


import cn.wtu.zld.chatroomsystem.entity.ChatRecord;

import java.util.List;

/**
 * 数据业务逻辑层接口，主要是提供好友之间聊天记录的业务逻辑代码
 * @author CodeDan
 * @time 2022年04月11日
 * **/
public interface ChatRecordService {
    /**
     * 用于获取当前在线好友和指定好友之间的聊天记录
     * @param userAccount
     *             指定好友账号
     * @param newAccount
     *             当前在线好友账号
     * @return list
     * */
    public List<ChatRecord> getChatRecord(String userAccount,String newAccount);


    /**
     * 用于写入当前在线好友和指定好友之间的聊天记录
     * @param userAccount
     *             指定好友账号
     * @param newAccount
     *             当前在线好友账号
     * @param message 聊天内容
     * @return list
     * */
    public void addChatRecordByService(String userAccount, String newAccount, String message );
}
