package cn.wtu.zld.chatroomsystem.mapper;


import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import cn.wtu.zld.chatroomsystem.entity.Friend;
import cn.wtu.zld.chatroomsystem.entity.User;
import org.apache.ibatis.annotations.Mapper;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * 数据持久层接口，用于好友的操作
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Resource
@Mapper
public interface CURDFriendMapper {
    /**
     * 用于查询指定用户的所有好友
     * @param account
     *             指定用户账号
     * @return User
     * */
    public List<Friend> getFriendListFromDataBase(String account);

    /**
     * 用于查询好友之间的未读数据量
     * @param map
     *             指定用户账号
     * @return User
     * */
    public Integer getFriendUnReadNumberFromDataBase(Map map);


    /**
     * 用于查询指定用户列表
     * @param inputText
     *             指定用户账号
     * @return User
     * */
    public List<User> getUserListFromDatabase(String inputText);

    /**
     * 用于查询好友申请列表
     * @param userAccount
     *             指定用户账号
     * @return User
     * */
    public List<User> getFriendRequestFromDatabase(String userAccount);

    /**
     * 用于修改与指定用户的好友表中数据（主要是修改最后一次发送的信息和其时间）
     * @param chatRecord
     *             当前登录用户
     * */
    public void updateFriendMessageAndTimeToDataBase(ChatRecord chatRecord);

    /**
     * 用于存储当前用户发送的好友申请数据
     * @param map
     *      存储了当前用户和指定添加好友用户账号
     *
     * */
    public Integer getFriendRequestFromDataBase(Map map);

    /**
     * 用于存储当前用户发送的好友申请数据
     * @param map
     *      存储了当前用户和指定添加好友用户账号
     *
     * */
    public void addFriendRequestToDataBase(Map map);

    /**
     * 用于删除当前用户与同意添加好友之间的好友申请数据
     * @param map
     *      存储了当前用户和同意添加好友用户账号
     *
     * */
    public void deleteOneFriendRequestToDataBase(Map map);

    /**
     * 用于删除当前用户与同意添加好友之间的好友申请数据
     * @param map
     *      存储了当前用户和同意添加好友用户账号
     *
     * */
    public void deleteFriendRequestToDataBase(Map map);

    /**
     * 用于插入当前用户和同意添加好友的好友记录(双方均插入)
     * @param map
     *      存储了当前用户和同意添加好友用户账号，默认的初始聊天记录，默认的初始聊天时间，和下线时间。
     *
     * */
    public void addFriendToDataBase(Map map);

    /**
     * 用于修改与指定用户的好友表中数据（主要是修改当前用户离线的时间）
     * @param friend
     *             当前登录用户
     * */
    public void updateFriendEndBackTimeToDataBase(Friend friend);

    /**
     * 用于删除当前用户和好友的好友关系
     * @param map
     *      存储了当前用户和同意添加好友用户账号
     *
     * */
    public void deleteFriendToDataBase(Map map);

}
