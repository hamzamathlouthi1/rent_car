package com.fmrent.userservice.controller;
import com.fmrent.userservice.dto.UserResponse; import com.fmrent.userservice.service.AdminUserService; import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/admin/users") public class AdminUserController {
    private final AdminUserService service; public AdminUserController(AdminUserService service){this.service=service;}
    @GetMapping public List<UserResponse> list(){return service.list();}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
