package cn.wtu.zld.chatroomsystem.mapper;

import cn.wtu.zld.chatroomsystem.entity.User;
import org.apache.ibatis.annotations.Mapper;

import javax.annotation.Resource;


/**
 * 数据持久层接口，用于获取关于用户注册登录操作所需的数据库数据
 * @author CodeDan
 * @time 2022年04月11日
 **/
@Resource
@Mapper
public interface LoginAndSignMapper {

    /**
     * 数据持久层接口，获取指定用户
     * @param user 用户对象
     * @Return string
     **/
    public User selectUserFromDataBases(User user);

    /**
     * 数据持久层接口，用于新增用户
     * @param user 用户对象
     * @Rerturn boolean
     * */
    public void insertUserToDataBases(User user);

    /**
     * 数据持久层接口，用于判断用户是否存在
     * @param userAccount 用户账号
     * @Rerturn User
     * */
    public User getUserFromDataBases(String userAccount);
}
