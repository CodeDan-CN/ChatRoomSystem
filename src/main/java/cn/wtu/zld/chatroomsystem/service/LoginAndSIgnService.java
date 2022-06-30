package cn.wtu.zld.chatroomsystem.service;

import cn.wtu.zld.chatroomsystem.entity.User;

/**
 * 业务逻辑层接口，关于用户注册登录操作的业务逻辑代码
 * @author CodeDan
 * @time 2022年04月11日
 **/
public interface LoginAndSIgnService {
    /**
     * 用于判断用户登录的业务逻辑
     * @param userAccount 用户账号
     * @param password 用户密码
     * @Return User
     **/
    public User examUserByService(String userAccount , String password);

    /**
     * 用于插入新用户的业务逻辑判断
     * @param user 新用户信息
     * @Return String
     **/
    public String insertUserByService(User user);

    /**
     * 用于获取指定用户信息
     * @param userAccount 用户账号
     * @Return User
     **/
    public User getUserDataByService(String userAccount);

}
