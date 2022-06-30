package cn.wtu.zld.chatroomsystem.service.impi;


import cn.wtu.zld.chatroomsystem.entity.ChatRecord;
import cn.wtu.zld.chatroomsystem.entity.Friend;
import cn.wtu.zld.chatroomsystem.entity.FriendList;
import cn.wtu.zld.chatroomsystem.entity.User;
import cn.wtu.zld.chatroomsystem.mapper.CURDFriendMapper;
import cn.wtu.zld.chatroomsystem.service.CurdFriendService;
import cn.wtu.zld.chatroomsystem.utils.RedisClient;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 数据业务逻辑层接口实现类，主要是实现CurdFriendService接口
 * @author CodeDan
 * @time 2022年04月11日
 * **/
@Service
public class CurdFriendServiceImpI implements CurdFriendService {

    private JedisPool jedisPool = RedisClient.getJedisPool();
    private final String CHATROOM_ONLINE = "chatRoom::online::people";

    @Autowired
    private CURDFriendMapper curdFriendMapper;

    @Override
    public FriendList getFriendListByService(String useraccount)  {
        Jedis jedis = jedisPool.getResource();
        //把自己添加到公共在线缓存中
        jedis.hset(CHATROOM_ONLINE,useraccount,"true");
        /**
         * 代码预留空间，Redis缓存好友列表
         * */
        //首先从数据库中获取好友列表
        List<Friend> friendList = curdFriendMapper.getFriendListFromDataBase(useraccount);
        //然后迭代好友列表从Redis的在线人数中获取好友列表中的在线好友
        FriendList  resultList = splitToOnlineAndOffline(friendList,useraccount,jedis);
        jedis.close();
        return resultList;

    }

    @Override
    public List<User> getUserListByService(String inputText) {
        return curdFriendMapper.getUserListFromDatabase(inputText);
    }

    @Override
    public List<User> getFriendRequestListByService(String userAccount) {
        return curdFriendMapper.getFriendRequestFromDatabase(userAccount);
    }

    @Override
    public String getFriendStatusByService(String userAccount) {
        Jedis jedis = jedisPool.getResource();
        String s = jedis.hget("chatRoom::online::people", userAccount);
        jedis.close();
        if(s == null){
            return "false";
        }else{
            return "true";
        }
    }

    @Override
    public List<String> getOnlineFriendListByService(String userAccount) {
        Jedis jedis = jedisPool.getResource();
        Map<String, String> stringStringMap = jedis.hgetAll(userAccount + "::online::friend");
        jedis.close();
        return new ArrayList<>(stringStringMap.keySet());
    }

    @Override
    public void addFriendByService(String userAccount, String friendAccount) {
        Jedis jedis = jedisPool.getResource();
        jedis.hset(userAccount + "::online::friend",friendAccount,"true");
        jedis.close();
    }

    @Override
    public void deleteAllByService(String useraccount) {
        Jedis jedis = jedisPool.getResource();
        jedis.del(useraccount + "::online::friend");
        if (jedis.hget(CHATROOM_ONLINE, useraccount) != null) {
            System.out.println(useraccount+"退出系统");
            jedis.hdel(CHATROOM_ONLINE, useraccount);
        }
        jedis.close();
        //修改一下数据库中数据
        Friend friend = new Friend();
        friend.setUserAccount(useraccount);
        String endTime =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        friend.setFriendEndBackTime(endTime);
        curdFriendMapper.updateFriendEndBackTimeToDataBase(friend);
    }

    @Override
    public void deleteFriendListByService(String userAccount, String friendAccount) {
        Map<String, String> map = new HashMap<>();
        map.put("userAccount",userAccount);
        map.put("friendAccount",friendAccount);
        curdFriendMapper.deleteFriendToDataBase(map);
    }

    @Override
    public void updateFriendMessageAndTimeByService(ChatRecord chatRecord) {
        curdFriendMapper.updateFriendMessageAndTimeToDataBase(chatRecord);
    }

    @Override
    public void deleteFriendByService(String userAccount, String friendAccount) {
        Jedis jedis = jedisPool.getResource();
        Map<String, String> map = jedis.hgetAll(userAccount + "::online::friend");
        if( map != null ){
            jedis.hdel(userAccount + "::online::friend",friendAccount);
        }
        jedis.close();
    }

    @Override
    public void addFrendRequestByService(String userAccount, String friendAccount) {
        Map<String, String> map = new HashMap<>();
        map.put("userAccount",userAccount);
        map.put("friendAccount",friendAccount);
        Integer number = curdFriendMapper.getFriendRequestFromDataBase(map);
        System.out.println(number);
        if( number == 0 ){
            curdFriendMapper.addFriendRequestToDataBase(map);
        }
    }

    @Override
    public void deleteFriendRequestByService(String userAccount, String friendAccount) {
        Map<String, String> map = new HashMap<>();
        map.put("userAccount",userAccount);
        map.put("friendAccount",friendAccount);
        curdFriendMapper.deleteOneFriendRequestToDataBase(map);
    }

    @Override
    public void updateFriendAndRequestByService(String userAccount, String friendAccount) {
        Map<String, String> map = new HashMap<>();
        map.put("userAccount",userAccount);
        map.put("friendAccount",friendAccount);
        curdFriendMapper.deleteFriendRequestToDataBase(map);
        map.put("endText","无信息");
        String nowtime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        map.put("endTime",nowtime);
        map.put("endBackTime",nowtime);
        curdFriendMapper.addFriendToDataBase(map);
    }

    /**
     * 用于将好友列表分为在线好友和离线好友两个列表，并把在用户好友在线列表放入Redis中建立缓存
     * @param friendList
     *             用户列表
     * @param useraccount
     *             当前用户账号
     * @Return FriendList
     * */
    private FriendList splitToOnlineAndOffline(List<Friend> friendList,String useraccount,Jedis jedis){
        List<Friend> onlineList = new ArrayList<>();
        List<Friend> offlineList = new ArrayList<>();
        Iterator<Friend> iterator = friendList.iterator();
        while( iterator.hasNext() ){
            Friend next = iterator.next();
            String account = next.getUserAccount();
            //除了划分之外，还额外的处理一下时间单位
            Date time = next.getEndTime();
            String endTime =  new SimpleDateFormat("HH:mm").format(time);
            next.setFriendEndTime(endTime);
            //进行数据查询，增加未读数据
            getFriendUnReadNumber(next,useraccount);
            if( "true".equals(jedis.hget(CHATROOM_ONLINE,account)) ){
                //如果此好友在线
                onlineList.add(next);
                System.out.println("当前"+account+"好友在线，建立缓存"+useraccount+"::online::friend");
                //建立自己的在线好友列表
                jedis.hset(useraccount+"::online::friend",account,"true");
            }else{
                //如果此好友不在线
                offlineList.add(next);
            }
        }

        FriendList resultList = new FriendList();
        resultList.setOnlineList(onlineList);
        resultList.setOfflineList(offlineList);
        return resultList;
    }



    /**
     * 查询当前好友的未读消息数量
     * 注意此Map中存在当前用户account和好友account，彼此最后一次消息发送时间，当前用户离线的时间。四个参数，如下所示
     * map{
     *     "userAccount":当前用户account;
     *     "friendAccount":好友account
     *     "endTime":彼此最后一次消息发送时间
     *     "endBackTime":当前用户离线的时间
     * }
     * @param friend
     *
     * */
    private void getFriendUnReadNumber(Friend friend,String useraccount){
        //作为参数传递
        Map<String,String> map = new HashMap<>();
        map.put("userAccount",useraccount);
        map.put("friendAccount",friend.getUserAccount());
        //时间要处理一下
        Date endTime = friend.getEndTime();
        Date endBackTime = friend.getEndBackTime();
        map.put("endTime",new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(endTime));
        map.put("endBackTime",new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(endBackTime));
        Integer number = curdFriendMapper.getFriendUnReadNumberFromDataBase(map);
        System.out.println(useraccount +"-----"+friend.getUserAccount()+"----"+number);
        friend.setUnReadNumber(number);
    }


}
