package com.fmrent.userservice.service;
import com.fmrent.userservice.dto.UserResponse; import com.fmrent.userservice.model.Role; import com.fmrent.userservice.repository.UserRepository;
import java.util.List; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.server.ResponseStatusException;
@Service public class AdminUserService {
    private final UserRepository users; public AdminUserService(UserRepository users){this.users=users;}
    @Transactional(readOnly=true) public List<UserResponse> list(){return users.findAllByOrderByCreatedAtDesc().stream().map(UserResponse::from).toList();}
    @Transactional public void delete(Long id){var target=users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Utilisateur introuvable.")); if(target.getRole()==Role.ADMIN) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Un administrateur ne peut pas être supprimé."); users.delete(target);}
}
