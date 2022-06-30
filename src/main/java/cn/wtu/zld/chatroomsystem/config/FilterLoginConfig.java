package cn.wtu.zld.chatroomsystem.config;

import cn.wtu.zld.chatroomsystem.filter.MyFilterLoginHandlerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FilterLoginConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注册TestInterceptor拦截器
        InterceptorRegistration registration = registry.addInterceptor(new MyFilterLoginHandlerInterceptor());
        registration.addPathPatterns("/**"); //所有路径都被拦截
        registration.excludePathPatterns(    //添加不拦截路径
                "/toLogin",                  //登录页面请求
                "/login",                    //登录请求
                "/toSign",                    //登录请求
                "/sign",                    //登录请求
                "/img/**",                   //img静态资源
                "/js/*.js",                  //js静态资源
                "/css/*.css",                //css静态资源
                "/fonts/**"
        );
    }
}
