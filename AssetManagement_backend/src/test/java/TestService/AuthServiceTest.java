package TestService;

import com.nashtech.rookies.AssetManagement.exceptions.ResourceNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.request.AccountLoginDto;
import com.nashtech.rookies.AssetManagement.model.dto.request.ChangePasswordDTO;
import com.nashtech.rookies.AssetManagement.model.entities.Accounts;
import com.nashtech.rookies.AssetManagement.model.entities.Role;
import com.nashtech.rookies.AssetManagement.repository.AccountsRepository;
import com.nashtech.rookies.AssetManagement.repository.AssignmentRepository;
import com.nashtech.rookies.AssetManagement.security.UserLocal;
import com.nashtech.rookies.AssetManagement.security.jwt.JwtUtils;
import com.nashtech.rookies.AssetManagement.security.service.UserDetailsImpl;
import com.nashtech.rookies.AssetManagement.services.impl.AccountsServiceImpl;
import com.nashtech.rookies.AssetManagement.services.impl.AuthServiceImpl;
import com.nashtech.rookies.AssetManagement.utils.MyDateUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.mockito.Mockito.*;

public class AuthServiceTest {

    private AuthenticationManager authenticationManager;

    private AccountsRepository accountsRepository;

    private PasswordEncoder encoder;

    private JwtUtils jwtUtils;

    private ModelMapper modelMapper;

    private UserDetailsImpl userDetails;

    private AuthServiceImpl authServiceImpl;
    private UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken;

    public AuthServiceTest() {}

    @BeforeEach
    public void beforeEach(){
        authenticationManager = mock(AuthenticationManager.class);
        accountsRepository = mock(AccountsRepository.class);
        encoder = mock(PasswordEncoder.class);
        jwtUtils = mock(JwtUtils.class);
        modelMapper = mock(ModelMapper.class);
        authServiceImpl= new AuthServiceImpl(authenticationManager,accountsRepository,encoder,jwtUtils,modelMapper);
        userDetails = mock(UserDetailsImpl.class);
    }

    @Test
    public void loginAccount_NotFoundUserName_ResourceNotFound(){
        AccountLoginDto accountLoginDto = new AccountLoginDto("khanh", "Test123@");
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> authServiceImpl.loginAccount(accountLoginDto));
        assertThat(exception.getMessage() ,is( "Username or password is incorrect. Please try again"));
    }

    @Test
    public void loginAccount_WhenStatusAccountIsTrue_ResourceNotFound(){
        Accounts accounts = mock(Accounts.class);
        AccountLoginDto accountLoginDto = new AccountLoginDto("khanh", "Test123@");
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.of(accounts));
        when(accounts.isStatus()).thenReturn(false);
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> authServiceImpl.loginAccount(accountLoginDto));
        assertThat(exception.getMessage() ,is( "Account is disable can not Login ."));
    }

    @Test
    public void loginAccount_WhenPasswordIsIncorrect_ResourceNotFound(){
        Accounts accounts = mock(Accounts.class);
        AccountLoginDto accountLoginDto = new AccountLoginDto("khanh", "Test123@");
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.of(accounts));
        when(accounts.isStatus()).thenReturn(true);
        when(encoder.matches(accountLoginDto.getPassword() , accounts.getPassword())).thenReturn(false);
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> authServiceImpl.loginAccount(accountLoginDto));
        assertThat(exception.getMessage() ,is( "Username or password is incorrect. Please try again"));
    }

    @Test
    public void loginAccount_WhenLoginSuccessfully_IsOkRequest(){
        Accounts accounts = mock(Accounts.class);
        AccountLoginDto accountLoginDto = new AccountLoginDto("khanh", "Test123@");
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.of(accounts));
        when(accounts.isStatus()).thenReturn(true);
        when(encoder.matches(accountLoginDto.getPassword() , accounts.getPassword())).thenReturn(true);
        Authentication authentication = mock(Authentication.class);
        when((UserDetailsImpl) authentication.getPrincipal()).thenReturn( userDetails);
        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(accountLoginDto.getUsername(), accountLoginDto.getPassword()))).thenReturn(authentication);
        List<String> roles = mock(List.class);
        when( roles.get(0)).thenReturn("staff");
//        ResponseEntity<?> result = authServiceImpl.loginAccount(accountLoginDto);
//        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }

}
