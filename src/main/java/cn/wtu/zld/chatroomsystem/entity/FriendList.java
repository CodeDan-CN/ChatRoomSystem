package cn.wtu.zld.chatroomsystem.entity;

import lombok.Data;

import java.util.List;

@Data
public class FriendList {
    private List<Friend> onlineList;
    private List<Friend> offlineList;
}
