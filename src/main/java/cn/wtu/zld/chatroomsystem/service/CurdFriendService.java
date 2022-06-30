package cn.wtu.zld.chatroomsystem.service;

import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import cn.wtu.zld.chatroomsystem.entity.FriendList;
import cn.wtu.zld.chatroomsystem.entity.User;
import redis.clients.jedis.Jedis;

import java.util.List;
import java.util.Map;

/**
 * 数据业务逻辑层接口，主要是提供好友之间操作接口的业务逻辑代码
 * @author CodeDan
 * @time 2022年04月11日
 * **/
public interface CurdFriendService {
    /**
     * 用于获取当前在线好友和离线好友列表并封装后返回
     * 细节操作：
     * 1）首先通过访问数据库获取指定用户的所有好友列表
     * 2）然后通过与Redis中的在线好友进行比对，
     * @param account
     *             客户端传来的信息
     * @return FriendList
     * */
    public FriendList getFriendListByService(String account);


    /**
     * 数据业务逻辑层接口，主要用于提供用户的检索
     * @param inputText
     * @return List
     * */
    public List<User> getUserListByService(String inputText);

    /**
     * 数据业务逻辑层接口，主要用于提供用户的好友申请的检索
     * @param userAccount
     * @return List
     * */
    public List<User> getFriendRequestListByService(String userAccount);

    /**
     * 数据业务逻辑层接口，主要用于添加好友状态的检索
     * @param userAccount
     * @return String
     * */
    public String getFriendStatusByService(String userAccount);

    /**
     * 数据业务逻辑层接口，主要用于处理获取在线好友的业务逻辑
     * @param userAccount
     * @return String
     * */
    public List<String> getOnlineFriendListByService(String userAccount);


    /**
     * 用于在指定用户的redis缓存下添加在线用户
     * @param userAccount
     *             当前登录用户
     * */
    public void addFriendByService(String userAccount,String friendAccount);

    /**
     * 用于删除关于当前用户的所有redis缓存
     * @param useraccount
     *             当前登录用户
     * */
    public void deleteAllByService(String useraccount);

    /**
     * 用于在指定用户的redis缓存下删除在线用户
     * @param userAccount
     *             当前登录用户
     * */
    public void deleteFriendByService(String userAccount,String friendAccount);

    /**
     * 用于修改与指定用户的好友表中数据（主要是修改最后一次发送的信息和其时间）
     * @param chatRecord
     *             当前登录用户
     * */
    public void updateFriendMessageAndTimeByService(ChatRecord chatRecord);

    /**
     * 用于存储当前用户发送的好友申请数据
     * @param userAccount 当前登录用户
     * @param friendAccount 申请好友用户
     *
     * */
    public void addFrendRequestByService(String userAccount, String friendAccount);

    /**
     * 用于删除当前用户拥有的的好友添加申请数据
     * @param userAccount 当前用户账号
     * @param friendAccount 添加好友账号
     *
     * */
    public void deleteFriendRequestByService(String userAccount, String friendAccount);

    /**
     * 用于处理当前用户发送的好友添加同意数据
     * @param userAccount 当前用户账号
     * @param friendAccount 添加好友账号
     *
     * */
    public void updateFriendAndRequestByService(String userAccount, String friendAccount);

    /**
     * 用于删除当前用户和好友的好友关系
     * @param userAccount 当前用户账号
     * @param friendAccount
     *                  好友账号
     *
     * */
    public void deleteFriendListByService(String userAccount, String friendAccount);

}
