package TestService;

import com.nashtech.rookies.AssetManagement.exceptions.ApiDeniedException;
import com.nashtech.rookies.AssetManagement.exceptions.ConstraintViolateException;
import com.nashtech.rookies.AssetManagement.exceptions.ResourceNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.request.ChangePasswordDTO;
import com.nashtech.rookies.AssetManagement.model.dto.respond.MessageResponse;
import com.nashtech.rookies.AssetManagement.model.entities.Accounts;
import com.nashtech.rookies.AssetManagement.model.entities.Assignment;
import com.nashtech.rookies.AssetManagement.model.entities.Role;
import com.nashtech.rookies.AssetManagement.repository.AccountsRepository;
import com.nashtech.rookies.AssetManagement.repository.AssignmentRepository;
import com.nashtech.rookies.AssetManagement.security.UserLocal;
import com.nashtech.rookies.AssetManagement.services.impl.AccountsServiceImpl;
import com.nashtech.rookies.AssetManagement.utils.MyDateUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import org.springframework.http.HttpStatus;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

public class AccountsServiceTest {
    private  AccountsServiceImpl accountsServiceImpl;

    private  AccountsRepository accountsRepository;

    private  AssignmentRepository assignmentRepository;

    private  MyDateUtils myDateUtils;

    private PasswordEncoder encoder;
    private  UserLocal userLocal;

    private Accounts account;

    private Role role;
    private ChangePasswordDTO changePasswordDTO;

    private char[] sortByte;

    private Pageable newPage;


    public AccountsServiceTest(){  }

    @BeforeEach
    public void beforeEach(){
        accountsRepository = mock(AccountsRepository.class);
        encoder = mock(PasswordEncoder.class);
        assignmentRepository = mock(AssignmentRepository.class);
        myDateUtils = mock(MyDateUtils.class);
        userLocal = mock(UserLocal.class);
        accountsServiceImpl = new AccountsServiceImpl(accountsRepository,encoder,assignmentRepository,myDateUtils,userLocal);
        account = mock(Accounts.class);
        role = mock(Role.class);

    }

    @Test
    public  void changePassword_NotFound_Account(){
        changePasswordDTO = mock(ChangePasswordDTO.class);
        when(accountsRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.changePassword(1,changePasswordDTO));
        assertThat(exception.getMessage() ,is( "Account Not Found"));
    }

    @Test
    public void changPassword_AccountNotFirstLoginAndPasswordIsIncorrect_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test1234@");
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(false);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void changePassword_AccountNotFirstLoginandPasswordNotChanged_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12345@");
        when(encoder.matches(changePasswordDTO.getNew_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void changePassword_AccountNotFirstLoginandLongerThaNewPasswordMoreThan15Characters_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "11111111111111111");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changePassword_AccountNotFirstLoginandLongerThaNewPasswordMinThan8Characters_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountNoFirstLoginAndNoHaveSpecialCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12345");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountNoFirstLoginAndNoHaveLowerCaseCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "TTT12345@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void changPassword_AccountNoFirstLoginAndNoHaveUpperCaseCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "ttt12345@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountNoFirstLoginAndNoHaveNumberCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Testttttt@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountNoFirstLogin_Successfully   (){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,false,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test123@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void changePassword_AccountFirstLoginAndPasswordNotChanged_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12345@");
        when(encoder.matches(changePasswordDTO.getNew_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changePassword_AccountFirstLoginandLongerThaNewPasswordMoreThan15Characters_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "11111111111111111");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changePassword_AccountFirstLoginandLongerThaNewPasswordMinThan8Characters_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountFirstLoginAndNoHaveSpecialCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test12345");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountFirstLoginAndNoHaveLowerCaseCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "TTT12345@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void changPassword_AccountFirstLoginAndNoHaveUpperCaseCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "ttt12345@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountFirstLoginAndNoHaveNumberCharacter_IsBadRequest(){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Testttttt@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }
    @Test
    public void changPassword_AccountFirstLogin_Successfully   (){
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role);
        changePasswordDTO = new ChangePasswordDTO("Test12345@", "Test123@");
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        when(encoder.matches(changePasswordDTO.getOld_password() , accounts.getPassword())).thenReturn(true);
        ResponseEntity<?> result = accountsServiceImpl.changePassword(1,changePasswordDTO);
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void DisableAccount_NotFoundAccount_ResourceNotFoundException(){
        when(accountsRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.disableAccount(1));
        assertThat(exception.getMessage() ,is( "Account Not Found"));
    }
    @Test
    public void DisableAccount_IsStatusAccountIsFalse_ResourceNotFoundException(){
        Accounts accounts = new Accounts("khanh", "Test12345@",false,true,role);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.disableAccount(1));
        assertThat(exception.getMessage() ,is( "Account Not Found"));
    }
    @Test
    public void DisableAccount_ListAssignmentStateAcceptedOrWaiting_for_acceptanceOrWaiting_for_returning_IsBadRequest(){
        List<Assignment> assignments = new ArrayList<>() ;
        for(int i=0 ; i<1 ;i++){
            Assignment assignment = new Assignment(1,"ACCEPTED");
            assignments.add(assignment);
        }
        assignments.add(new Assignment(2,"waiting_for_acceptance"));
        assignments.add(new Assignment(3,"waiting_for_returning"));
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role,assignments);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        ResponseEntity<?> result = accountsServiceImpl.disableAccount(1);
        assertThat(result.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void DisableAccount_IsSuccessFully_IsOk(){
        List<Assignment> assignments = new ArrayList<>() ;
        for(int i=0 ; i<1 ;i++){
            Assignment assignment = new Assignment(1,"DECLINE");
            assignments.add(assignment);
        }
        Accounts accounts = new Accounts("khanh", "Test12345@",true,true,role,assignments);
        when(accountsRepository.findById(1)).thenReturn(Optional.of(accounts));
        ResponseEntity<?> result = accountsServiceImpl.disableAccount(1);
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void isAssigned_NotFoundAccount_ResourceNotFoundException(){
        when(accountsRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.isAssigned(1));
        assertThat(exception.getMessage() ,is( "User not detected"));
    }
    @Test
    public void isAssigned_GetListAssignmentByAccountIdIsEmpty_IsOk(){
        when(accountsRepository.findById(1)).thenReturn(Optional.of(account));
        List<Assignment> list = new ArrayList<>();
        when(assignmentRepository.getListAssignmentByAccountId(1)).thenReturn(list);
        ResponseEntity<?> result = accountsServiceImpl.isAssigned(1);
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void isAssigned_GetListAssignmentByAccountIdNoStateIsAcceptedOrWaiting_for_acceptanceOrWaiting_for_returning_IsOK(){
        when(accountsRepository.findById(1)).thenReturn(Optional.of(account));
        List<Assignment> assignments = new ArrayList<>() ;
        for(int i=0 ; i<1 ;i++){
            Assignment assignment = new Assignment(1,"DECLINE");
            assignments.add(assignment);
        }
        when(assignmentRepository.getListAssignmentByAccountId(1)).thenReturn(assignments);
        ResponseEntity<?> result = accountsServiceImpl.isAssigned(1);
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void isAssigned_GetListAssignmentByAccountIdStateIsAcceptedOrWaitingForAcceptanceOrWaitingForReturning_ConstraintViolateException(){
        when(accountsRepository.findById(1)).thenReturn(Optional.of(account));
        List<Assignment> assignments = new ArrayList<>() ;
        for(int i=0 ; i<1 ;i++){
            Assignment assignment = new Assignment(1,"accepted");
            assignments.add(assignment);
        }
        when(assignmentRepository.getListAssignmentByAccountId(1)).thenReturn(assignments);
        ConstraintViolateException exception = Assertions.assertThrows(ConstraintViolateException.class,
                () -> accountsServiceImpl.isAssigned(1));
        assertThat(exception.getMessage() ,is( "User cannot delete due to assignment already exist"));
    }
    @Test
    public void deleteUser_NameAccountLocalEqualUserName_ApiDeniedException(){
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.of(account));
        when(userLocal.getLocalUserName()).thenReturn("khanh");
        ApiDeniedException exception = Assertions.assertThrows(ApiDeniedException.class,
                () -> accountsServiceImpl.deleteUser("khanh"));
        assertThat(exception.getMessage() ,is( "You have to sign out and log in another account before delete yourself"));
    }

    @Test
    public void deleteUser_AccountNotFound_ResourceNotFoundException(){
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.empty());
        when(userLocal.getLocalUserName()).thenReturn("khanh2");
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.deleteUser("khanh"));
        assertThat(exception.getMessage() ,is( "Account Not Found with use name : khanh"));
    }
    @Test
    public void deleteUser_AccountDeleteSuccessFully_IsOk(){
        when(accountsRepository.findByuserName("khanh")).thenReturn(Optional.of(account));
        when(userLocal.getLocalUserName()).thenReturn("khanh2");
        ResponseEntity<?> result = accountsServiceImpl.deleteUser("khanh");
        assertThat(result.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void createPage_SortCol_ResourceNotFoundException(){
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.createPage(0,20,"va"));
        assertThat(exception.getMessage() ,is( "NO COLUMN SORT FOUND"));
    }
    @Test
    public void createPage_SortMode_ResourceNotFoundException(){
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> accountsServiceImpl.createPage(0,20,"sm"));
        assertThat(exception.getMessage() ,is( "NO MODE SORT FOUND"));
    }

    @Test
    public void listAccountDetailBySearch_SearchCodeNull_ConstraintViolateException(){
        ConstraintViolateException exception = Assertions.assertThrows(ConstraintViolateException.class,
                () -> accountsServiceImpl.listAccountDetailBySearch("",0,"",""));
        assertThat(exception.getMessage() ,is( "Please enter at least one character"));
    }

}
